import { Node, AudioSource, AudioClip, resources, director, _decorator, Component, ccenum } from 'cc';



export default class AudioManager {
    //AudioMgr.ts
    /**
     * @en
     * this is a sington class for audio play, can be easily called from anywhere in you project.
     * @zh
     * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
     */
    private static _inst: AudioManager;
    public static get inst(): AudioManager {
        if (this._inst == null) {
            this._inst = new AudioManager();
        }
        return this._inst;
    }
    static restart() {
        this._inst = null;
    }

    private _audioSource: AudioSource;

    // ========== 音效并发控制 ==========
    /** 短时间窗口（秒），用于限制总体并发 */
    private _playWindow: number = 0.05;
    /** 时间窗口内最大播放数 */
    private _maxPlaysPerWindow: number = 3;
    /** 环形缓冲区替代 Array.shift，记录播放时间戳 */
    private _playTimeRing: number[] = [];
    private _ringHead: number = 0;
    private _ringCount: number = 0;
    /** 当前窗口是否已饱和（快速短路标记） */
    private _windowSaturated: boolean = false;
    /** _windowSaturated 标记时的饱和时间戳，过期后重置 */
    private _saturatedUntil: number = 0;
    /** 每个音效上次播放的时间戳（含冷却间隔） */
    private _lastPlayTimeMap: Map<string, number> = new Map();

    constructor() {
        //@en create a node as audioMgr
        //@zh 创建一个节点作为 audioMgr
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr);

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);
    }

    public get audioSource() {
        return this._audioSource;
    }

    /**
     * @zh 配置音效总体并发控制参数
     * @param maxPlaysPerWindow 短时间窗口内最大同时播放数，默认3
     * @param playWindow 时间窗口（秒），默认0.05
     */
    public configureConcurrent(
        maxPlaysPerWindow: number = 3,
        playWindow: number = 0.05
    ) {
        this._maxPlaysPerWindow = maxPlaysPerWindow;
        this._playWindow = playWindow;
        this._playTimeRing = new Array(this._maxPlaysPerWindow);
        this._ringHead = 0;
        this._ringCount = 0;
        this._windowSaturated = false;
        this._saturatedUntil = 0;
    }

    /** 获取音效的唯一标识 */
    private _getSoundKey(sound: AudioClip | string): string {
        if (sound instanceof AudioClip) {
            return '__clip__' + sound.name;
        }
        return sound;
    }

    /** 清理过期的播放时间记录（O(1) 环形缓冲区操作，无 shift） */
    private _updateWindowState(now: number) {
        const cutoff = now - this._playWindow;
        while (this._ringCount > 0) {
            const idx = (this._ringHead - this._ringCount + this._maxPlaysPerWindow) % this._maxPlaysPerWindow;
            if (this._playTimeRing[idx] >= cutoff) break;
            this._ringCount--;
        }
        // 饱和标记过期判断已移至 _canPlaySound 入口处，此处不再重复处理
    }

    /** 检查是否允许播放该音效（冷却由调用方指定） */
    private _canPlaySound(key: string, cooldown: number): boolean {
        const now = Date.now() / 1000;

        // 饱和标记检查必须放在 _updateWindowState 之前，但饱和过期判断必须在 return false 之前
        if (this._windowSaturated) {
            if (now >= this._saturatedUntil) {
                this._windowSaturated = false;
            } else {
                return false;
            }
        }

        this._updateWindowState(now);

        // 同一音效冷却检查
        if (cooldown > 0) {
            const lastTime = this._lastPlayTimeMap.get(key);
            if (lastTime !== undefined && (now - lastTime) < cooldown) {
                return false;
            }
        }

        // 总体并发数检查
        if (this._ringCount >= this._maxPlaysPerWindow) {
            this._windowSaturated = true;
            this._saturatedUntil = now + this._playWindow;
            return false;
        }

        return true;
    }

    /** 记录音效播放（仅在需要冷却时记录时间戳） */
    private _recordPlay(key: string, cooldown: number) {
        const now = Date.now() / 1000;
        // 环形缓冲区写入
        this._playTimeRing[this._ringHead] = now;
        this._ringHead = (this._ringHead + 1) % this._maxPlaysPerWindow;
        if (this._ringCount < this._maxPlaysPerWindow) this._ringCount++;
        if (cooldown > 0) {
            this._lastPlayTimeMap.set(key, now);
        }
    }

    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume 音量
     * @param cooldown 同一音效的最小播放间隔（秒），默认0不限制。
     *                 适合怪物被击等大量重复场景：传入如0.08，
     *                 同一音效80ms内不会重复播放；枪声等无需节流的音效传0即可。
     */
    playOneShot(sound: AudioClip | string, volume: number = 1.0, cooldown: number = 0) {
        const key = this._getSoundKey(sound);

        // 并发控制检查
        if (!this._canPlaySound(key, cooldown)) {
            return;
        }

        this._recordPlay(key, cooldown);

        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    play(sound: AudioClip | string, volume: number = 1.0) {
        if (sound instanceof AudioClip) {
            this.audioSource.stop();
            this.audioSource.clip = sound;
            this.audioSource.loop = true;
            this.audioSource.play();
            this.audioSource.volume = volume;
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this.audioSource.stop();
                    this.audioSource.clip = clip;
                    this.audioSource.loop = true;
                    this.audioSource.play();
                    this.audioSource.volume = volume;
                }
            });
        }
    }


    /**
     * stop the audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * pause the audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * resume the audio play
     */
    resume() {
        this._audioSource.play();
    }

}
