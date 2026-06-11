import { Node, AudioSource, Director, director, AudioClip } from "cc";
import { EDITOR } from "cc/env";
import { dataMgr } from "./DataMgr";
import { resMgr } from "./ResMgr";
export enum SoundEnum {

    Sound_Upgrade = "resources/sound/Sound_Up",
    Sound_GetGold = "resources/sound/Sound_GetGold",
    Sound_Shop = "resources/sound/Sound_Shop",
    Sound_PushItem = "",
    // Sound_GetItem = "resources/sound/Sound_GetItem",

    // Sound_Slash = "resources/sound/Sound_slash",

    //为空的此项目不用
    Sound_Skill_Arrow = "",
    Sound_Skill_Ice = "",
    Sound_Skill_Fire = "",
    Sound_Skill_Lightning = "",

    Sound_MonsterDie = "resources/sound/Sound_MonsterDie",
    Sound_HeroDie = "resources/sound/Sound_HeroDie",
    Sound_HeroHurt = "resources/sound/Sound_Hurt",
    // Sound_BossDie = "",

    Sound_Success = "resources/sound/Sound_Win",
    Sound_Fail = "resources/sound/Sound_Fail",
    Sound_BGM = "resources/sound/BGM",

    Sound_Fishing = "resources/sound/甩杆",
    Sound_FishingUp_Success = "resources/sound/钓鱼拉杆成功",
    Sound_FishingUp_Fail = "resources/sound/钓鱼拉杆失败",
    Sound_FishingNet = "resources/sound/渔网捕鱼",
}
/** 
 * 音频管理器
 * 提供音乐和音效的播放、暂停、复位功能。
 */
export class AudioMgr {
    /** 音乐播放组件 */
    private musicSource: AudioSource;

    /**
     * 持久循环音效声道(Persistent looping SFX channel)
     * 与 playOneShot 池分离，需单独 stop 的长循环音效
     */
    private loopEffectSource: AudioSource | null = null;


    /** 当前持久循环音效资源路径，用于避免同路径重复起播 */
    private persistentLoopPath: string | null = null;

    /** 音效播放组件池 */
    private effectSourcePool: AudioSource[] = [];

    /** 音乐音量 */
    private musicVolume: number;

    /** 音效音量 */
    private effectVolume: number;

    /** 当前音效组件池索引 */
    private effectSourceIndex: number = 0;

    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {
        if (!EDITOR) {
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, this.init, this);
        }
    }

    private static _inst: AudioMgr;
    /** 单例实例 */
    public static get instance(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }
    /** 初始化 */
    private init(): void {
        this.musicVolume = dataMgr.getNumber("musicVolume") ?? 0.5;
        this.effectVolume = dataMgr.getNumber("effectVolume") ?? 0.5;

        /** 创建节点 */
        const audioMgrNode = new Node("__AudioMgr__");
        director.getScene().addChild(audioMgrNode);

        this.musicSource = this.createAudioSource(audioMgrNode, this.musicVolume);
        this.loopEffectSource = this.createAudioSource(audioMgrNode, this.effectVolume);
        this.loopEffectSource.loop = true;
        for (let i = 0; i < 5; i++) {
            this.effectSourcePool.push(this.createAudioSource(audioMgrNode, this.effectVolume));
        }
    }

    /**
     * 创建音频源
     * @param node 节点
     * @param volume 音量
     * @returns AudioSource 音频源组件
     */
    private createAudioSource(node: Node, volume: number): AudioSource {
        const source = node.addComponent(AudioSource);
        source.loop = false;
        source.playOnAwake = false;
        source.volume = volume;
        return source;
    }

    /**
     * 播放音乐
     * @param path 音乐路径
     * @param loop 是否循环播放，默认为'true'
     * @param volume 音量大小，默认为'1.0'
     * @returns Promise<void> 播放完成后的Promise
     */
    public async playMusic(path: string, loop: boolean = true, volume: number = 1.0): Promise<void> {
        const clip = await resMgr.loadRes<AudioClip>(path);
        this.musicSource.stop();
        this.musicSource.clip = clip;
        this.musicSource.loop = loop;
        this.musicSource.volume = this.musicVolume * volume;
        this.musicSource.play();
    }
    public curMusicTime() {
        return this.musicSource.currentTime;
    }
    /** 重播当前音乐 */
    public replayMusic(): void {
        this.musicSource.stop();
        this.musicSource.play();
    }

    /** 暂停当前播放的音乐 */
    public pauseMusic(): void {
        this.musicSource.pause();
    }
    public resumeMusic(): void {
        if (this.musicSource.playing) return;
        this.musicSource.play();
    }
    /** 停止当前播放的音乐 */
    public stopMusic(): void {
        this.musicSource.stop();
    }

    /**
     * 播放音效
     * @param path 音效路径
     * @param volume 音量大小，默认为'1.0'
     * @returns Promise<void> 播放完成后的Promise
     */
    public async playSound(path: string, volume: number = 1.0): Promise<void> {
        if (!path) return;
        // app.log.debug("播放音效：", path);
        const clip = await resMgr.loadRes<AudioClip>(path);
        const source = this.getNextEffectSource();
        source.playOneShot(clip, this.effectVolume * volume);
    }

    /**
     * 开始持久循环音效（专用声道，不与 playSound 共用池）
     * @param path 音效路径
     * @param volumeScale 相对全局音效音量的系数，默认 1.0
     */
    public async playPersistentLoopSound(path: string, volumeScale: number = 1.0): Promise<void> {
        return;
        if (!this.loopEffectSource) return;
        const clip = await resMgr.loadRes<AudioClip>(path);
        if (this.persistentLoopPath === path && this.loopEffectSource.playing) {
            this.loopEffectSource.volume = this.effectVolume * volumeScale;
            return;
        }
        this.loopEffectSource.stop();
        this.loopEffectSource.clip = clip;
        this.loopEffectSource.loop = true;
        this.persistentLoopPath = path;
        this.loopEffectSource.volume = this.effectVolume * volumeScale;
        this.loopEffectSource.play();
    }

    /** 停止持久循环音效并释放声道状态 */
    public stopPersistentLoopSound(): void {
        if (!this.loopEffectSource) return;
        this.loopEffectSource.stop();
        this.loopEffectSource.clip = null;
        this.persistentLoopPath = null;
    }

    /**
     * 获取下一个音效组件
     * @returns AudioSource 下一个音效组件
     */
    private getNextEffectSource(): AudioSource {
        const source = this.effectSourcePool[this.effectSourceIndex];
        this.effectSourceIndex = (this.effectSourceIndex + 1) % this.effectSourcePool.length;
        return source;
    }

    /**
     * 设置音乐音量
     * @param volume 音量大小，范围为 0.0 到 1.0
     */
    public setMusicVolume(volume: number): void {
        this.musicVolume = volume;
        this.musicSource.volume = volume;
        dataMgr.setData("musicVolume", volume);
    }

    /**
     * 获取当前音乐音量
     * @returns 当前音乐音量，范围为 0.0 到 1.0
     */
    public getMusicVolume(): number {
        return this.musicVolume;
    }

    /**
     * 设置音效音量
     * @param volume 音量大小，范围为 0.0 到 1.0
     */
    public setEffectVolume(volume: number): void {
        this.effectVolume = volume;
        this.effectSourcePool.forEach((source) => (source.volume = volume));
        if (this.loopEffectSource && this.loopEffectSource.playing) {
            this.loopEffectSource.volume = volume;
        }
    }

    /**
     * 获取当前音效音量
     * @returns 当前音效音量，范围为 0.0 到 1.0
     */
    public getEffectVolume(): number {
        return this.effectVolume;
    }
}

