System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Node, AudioSource, AudioClip, resources, director, AudioManager, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Node = _cc.Node;
      AudioSource = _cc.AudioSource;
      AudioClip = _cc.AudioClip;
      resources = _cc.resources;
      director = _cc.director;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fd17fBiiB9BpaHrT4FRFJtT", "AudioManager", undefined);

      __checkObsolete__(['Node', 'AudioSource', 'AudioClip', 'resources', 'director', '_decorator', 'Component', 'ccenum']);

      _export("default", AudioManager = class AudioManager {
        static get inst() {
          if (this._inst == null) {
            this._inst = new AudioManager();
          }

          return this._inst;
        }

        static restart() {
          this._inst = null;
        }

        constructor() {
          this._audioSource = void 0;
          // ========== 音效并发控制 ==========

          /** 短时间窗口（秒），用于限制总体并发 */
          this._playWindow = 0.05;

          /** 时间窗口内最大播放数 */
          this._maxPlaysPerWindow = 3;

          /** 环形缓冲区替代 Array.shift，记录播放时间戳 */
          this._playTimeRing = [];
          this._ringHead = 0;
          this._ringCount = 0;

          /** 当前窗口是否已饱和（快速短路标记） */
          this._windowSaturated = false;

          /** _windowSaturated 标记时的饱和时间戳，过期后重置 */
          this._saturatedUntil = 0;

          /** 每个音效上次播放的时间戳（含冷却间隔） */
          this._lastPlayTimeMap = new Map();
          this._clipCache = new Map();
          this._loadingClipSet = new Set();
          this._loadingCallbackMap = new Map();
          //@en create a node as audioMgr
          //@zh 创建一个节点作为 audioMgr
          let audioMgr = new Node();
          audioMgr.name = '__audioMgr__'; //@en add to the scene.
          //@zh 添加节点到场景

          director.getScene().addChild(audioMgr); //@en make it as a persistent node, so it won't be destroied when scene change.
          //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了

          director.addPersistRootNode(audioMgr); //@en add AudioSource componrnt to play audios.
          //@zh 添加 AudioSource 组件，用于播放音频。

          this._audioSource = audioMgr.addComponent(AudioSource);
        }

        get audioSource() {
          return this._audioSource;
        }
        /**
         * @zh 配置音效总体并发控制参数
         * @param maxPlaysPerWindow 短时间窗口内最大同时播放数，默认3
         * @param playWindow 时间窗口（秒），默认0.05
         */


        configureConcurrent(maxPlaysPerWindow = 3, playWindow = 0.05) {
          this._maxPlaysPerWindow = maxPlaysPerWindow;
          this._playWindow = playWindow;
          this._playTimeRing = new Array(this._maxPlaysPerWindow);
          this._ringHead = 0;
          this._ringCount = 0;
          this._windowSaturated = false;
          this._saturatedUntil = 0;
        }
        /** 获取音效的唯一标识 */


        _getSoundKey(sound) {
          if (sound instanceof AudioClip) {
            return '__clip__' + sound.name;
          }

          return sound;
        }

        preload(sound, onComplete = null) {
          if (sound instanceof AudioClip) {
            this._clipCache.set(this._getSoundKey(sound), sound);

            onComplete == null || onComplete(sound);
            return;
          }

          const cachedClip = this._clipCache.get(sound);

          if (cachedClip) {
            onComplete == null || onComplete(cachedClip);
            return;
          }

          if (onComplete) {
            let callbacks = this._loadingCallbackMap.get(sound);

            if (!callbacks) {
              callbacks = [];

              this._loadingCallbackMap.set(sound, callbacks);
            }

            callbacks.push(onComplete);
          }

          if (this._loadingClipSet.has(sound)) {
            return;
          }

          this._loadingClipSet.add(sound);

          resources.load(sound, (err, clip) => {
            this._loadingClipSet.delete(sound);

            if (err) {
              console.log(err);

              this._completePreloadCallbacks(sound, null);

              return;
            }

            this._clipCache.set(sound, clip);

            this._completePreloadCallbacks(sound, clip);
          });
        }

        _completePreloadCallbacks(sound, clip) {
          const callbacks = this._loadingCallbackMap.get(sound);

          if (!callbacks) {
            return;
          }

          this._loadingCallbackMap.delete(sound);

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i](clip);
          }
        }
        /** 清理过期的播放时间记录（O(1) 环形缓冲区操作，无 shift） */


        _updateWindowState(now) {
          const cutoff = now - this._playWindow;

          while (this._ringCount > 0) {
            const idx = (this._ringHead - this._ringCount + this._maxPlaysPerWindow) % this._maxPlaysPerWindow;
            if (this._playTimeRing[idx] >= cutoff) break;
            this._ringCount--;
          } // 饱和标记过期判断已移至 _canPlaySound 入口处，此处不再重复处理

        }
        /** 检查是否允许播放该音效（冷却由调用方指定） */


        _canPlaySound(key, cooldown) {
          const now = Date.now() / 1000; // 饱和标记检查必须放在 _updateWindowState 之前，但饱和过期判断必须在 return false 之前

          if (this._windowSaturated) {
            if (now >= this._saturatedUntil) {
              this._windowSaturated = false;
            } else {
              return false;
            }
          }

          this._updateWindowState(now); // 同一音效冷却检查


          if (cooldown > 0) {
            const lastTime = this._lastPlayTimeMap.get(key);

            if (lastTime !== undefined && now - lastTime < cooldown) {
              return false;
            }
          } // 总体并发数检查


          if (this._ringCount >= this._maxPlaysPerWindow) {
            this._windowSaturated = true;
            this._saturatedUntil = now + this._playWindow;
            return false;
          }

          return true;
        }
        /** 记录音效播放（仅在需要冷却时记录时间戳） */


        _recordPlay(key, cooldown) {
          const now = Date.now() / 1000; // 环形缓冲区写入

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


        playOneShot(sound, volume = 1.0, cooldown = 0) {
          const key = this._getSoundKey(sound); // 并发控制检查


          if (!this._canPlaySound(key, cooldown)) {
            return;
          }

          this._recordPlay(key, cooldown);

          if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
          } else {
            const clip = this._clipCache.get(sound);

            if (clip) {
              this._audioSource.playOneShot(clip, volume);

              return;
            }

            resources.load(sound, (err, clip) => {
              if (err) {
                console.log(err);
              } else {
                this._clipCache.set(sound, clip);

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


        play(sound, volume = 1.0) {
          if (sound instanceof AudioClip) {
            this.audioSource.stop();
            this.audioSource.clip = sound;
            this.audioSource.loop = true;
            this.audioSource.play();
            this.audioSource.volume = volume;
          } else {
            resources.load(sound, (err, clip) => {
              if (err) {
                console.log(err);
              } else {
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

      });

      //AudioMgr.ts

      /**
       * @en
       * this is a sington class for audio play, can be easily called from anywhere in you project.
       * @zh
       * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
       */
      AudioManager._inst = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e96bc804d4af33012a1ad5c19177a551c107f2ae.js.map