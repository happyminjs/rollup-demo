import jQueryjPlayer from './jQuery.jplayer'
new jQueryjPlayer();

function VideoPlayer(b) {
  this.op = $.extend(
    {
      videoPath: "http://www.zhangxinxu.com/study/media/cat.mp4",

      supplied: "webmv, ogv, m4v,3gpp",
      size: {
        width: "100%",
        height: "350px"
      },
      verticalVolume: true,
      loop: false,
      useStateClassSkin: true,
      autoBlur: false,
      smoothPlayBar: true,
      keyEnabled: true,
      remainingDuration: true,
      toggleDuration: true
    },
    b
  );
  (this.dom = {
    videoBox: $(this.op.container),
    videoWin: $(".jp-jplayer"),
    playBtn: $(".jp-play"),
    stopBtn: $(".jp-stop"),
    repeatBtn: $(".jp-repeat"),
    toggleBtn: $("[toggle]"),
    volumeCto: $(".jp-volume-controls"),
    volumnBarWarp: $(".jp-volume-bar-wrap"),
    volumnMute: $(".jp-mute"),
    volumnMax: $(".jp-volume-max"),
    volumnBar: $(".jp-volume-bar"),
    stateDialog: $(".jp-state-dialog"),
    networkDialog: $(".jp-networkError-dialog"),
    closeBtn: $(".jp-btn-close"),
    reloadBtn: $(".jp-btn-reload"),
    tipsTitle: $(".jp-state-text"),
    tipsBtn: $(".jp-state-button"),
    tipsLogo: $(".jp-state-logo")
  }),
    (this.state = {
      waiting: undefined,
      reloadTimes: 0,
      errored: false,
      stalled: false,
      finished: false
    });
  this.tips = {
    errored: {
      title: "点击刷新",
      btn: "点击刷新",
      cls: "jp-refresh-animate"
    },
    stalled: {
      title: "加载中…",
      btn: false,
      cls: "jp-loading-animate"
    },
    finished: {
      title: "点击重播",
      btn: "点击重播",
      cls: "jp-replay-animate"
    }
  };
  this.init();
  this.acts();
}
VideoPlayer.prototype = {
  init: function() {
    var b = this;
    var _forbidden = b.dom.videoBox || b.dom.videoWin;
    _forbidden.on("contextmenu", function(e) {
      return false;
    });
    if(b.dom.videoWin.jPlayer){
      b.dom.videoWin.jPlayer({
        ready: function() {
          $(this).jPlayer("setMedia", {
            m4v: b.op.videoPath
          });
        },
        error: function(c) {
          b.op.handleError.call(b, c);
        },
        verticalVolume: b.op.verticalVolume,
        loop: b.op.loop,
        swfPath: b.op.swfPath,
        solution: b.op.solution,
        supplied: b.op.supplied,
        size: b.op.size,
        preload: "none",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: false,
        toggleDuration: true
      });
    }
    
  },

  acts: function() {
    var b = this;
    // b.dom.volumeCto.hover(function() {
    //     b.dom.volumnBarWarp.show();
    //     b.dom.volumnMute.addClass('active');
    // }, function() {
    //     b.dom.volumnBarWarp.hide();
    //     b.dom.volumnMute.removeClass('active');
    // });
    b.dom.volumeCto
      .mouseover(function() {
        b.dom.volumnBarWarp.show();
        b.dom.volumnMute.addClass("active");
      })
      .mouseout(function() {
        b.dom.volumnBarWarp.hide();
        b.dom.volumnMute.removeClass("active");
      });
    b.dom.volumnMax.click(function(c) {
      $(this).addClass("active");
    });
    b.dom.repeatBtn.click(function() {
      $(this).toggleClass("active");
    });
    b.dom.volumnBar.click(function() {
      b.dom.volumnMax.removeClass("active");
    });
    // b.dom.videoWin.on( $.jPlayer.event.waiting, function(c) {
    //   b.state.stalled = true;
    //   b.state.waiting = setTimeout(function() {
    //     if (b.state.stalled && !b.state.errored) {
    //       b.showTips(b.tips.stalled);
    //     }
    //   }, 3000);
    // });
    // b.dom.videoWin.on($.jPlayer.event.playing, function(c) {
    //   b.state.finished = false;
    //   b.state.errored = false;
    //   b.state.stalled = false;
    //   clearTimeout(b.state.waiting);
    //   b.hideTips();
    // });
    // b.dom.videoWin.on($.jPlayer.event.ended, function(c) {
    //   b.state.finished = true;
    //   b.showTips(b.tips.finished);
    // });
    // b.dom.videoWin.on($.jPlayer.event.error, function(c) {
    //   b.state.errored = true;
    //   b.showTips(b.tips.errored);
    // });
    b.dom.closeBtn.click(function() {
      b.dom.stateDialog.hide();
    });
    b.dom.reloadBtn.click(function() {
      if (b.state.errored) {
        if (++b.state.reloadTimes >= 5) {
          location.reload();
        } else {
          b.play();
        }
        b.hideTips();
      } else {
        if (b.state.finished) {
          b.hideTips();
          b.play();
        }
      }
      // b.dom.reloadBtn.hide();
    });
  },
  show: function(b) {
    var c = this;
    b ? c.dom.videoBox.show() : c.dom.videoBox.hide();
  },
  showTips: function(e) {
    var c = this;
    var d = e.title;
    var b = e.btn;
    var f = e.cls;
    var h = c.dom.tipsTitle;
    if (d) {
      c.dom.tipsTitle.html(d);
    }
    if (b) {
      c.dom.tipsBtn.show();
      // c.dom.tipsBtn.html(b)
    }
    if (b === false) {
      // c.dom.tipsBtn.html(d)
      c.dom.tipsBtn.removeClass("jp-btn-reload");
    }
    if (f) {
      c.dom.tipsLogo
        .removeClass()
        .addClass("jp-state-logo")
        .addClass(f);
    }
    c.dom.networkDialog.show();
  },
  hideTips: function() {
    this.dom.networkDialog.hide();
  },
  play: function(c) {
    var b = this;
    switch (c) {
      case "play":
        b.dom.videoWin.jPlayer("play");
        break;
      case "stop":
        b.dom.videoWin.jPlayer("stop");
        break;
      case "repeat":
        b.dom.repeatBtn.trigger("click");
        break;
      default:
        b.dom.videoWin.jPlayer("play");
    }
  },
  handleError: function(b) {
    // console.log(b);

    console.log(b.jPlayer.error);
  }
};
export default VideoPlayer;