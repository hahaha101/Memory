var Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        winAudio: {
            default: null,
            url: cc.AudioClip
        },

        loseAudio: {
            default: null,
            url: cc.AudioClip
        },
        diamondAudio: {
            default: null,
            url: cc.AudioClip
        },

        propAudio: {
            default: null,
            url: cc.AudioClip
        },

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    playMusic: function() {
        if(Types.musicOn == 1){
            cc.audioEngine.playMusic( this.bgm, true );
        }
    },

    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function(clip) {
        cc.audioEngine.playEffect( clip, false );
    },

    playWin: function() {
        if(Types.soundOn == 1){
            this._playSFX(this.winAudio);
        }
    },

    playLose: function() {
        if(Types.soundOn == 1){
            this._playSFX(this.loseAudio);
        }
    },
    playDiamond: function() {
        if(Types.soundOn == 1){
            this._playSFX(this.diamondAudio);
        }
    },

    playProp: function() {
        if(Types.soundOn == 1){
            this._playSFX(this.propAudio);
        }
    },

    playButton: function() {
        if(Types.soundOn == 1){
            this._playSFX(this.buttonAudio);
        }
    }
});
