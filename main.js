/**
 * 1. render songs
 * 2. scroll top
 * 3. play/ pause/ seek
 * 4. CD rotate
 * 5. next/ prev
 * 6. Random
 * 7. next/ repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. playing song when clicking
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

console.log(localStorage);
//
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Happy Birthday to You",
      singer: "Youtube",
      path: "./assets/mp3/Happy Birthday to You.mp3",
      image: "./assets/imgs/birthdaycake.png",
    },
    {
      name: "Nếu lúc đó",
      singer: "Tờ Ling",
      path: "./assets/mp3/song1.mp3",
      image: "./assets/imgs/song1.png",
    },

    {
      name: "Cơn mưa xa dần",
      singer: "Sếp",
      path: "./assets/mp3/song2.mp3",
      image: "./assets/imgs/song2.png",
    },
    {
      name: "Vibe",
      singer: "BTS",
      path: "./assets/mp3/song3.mp3",
      image: "./assets/imgs/song3.png",
    },
    {
      name: "Bật lên tình yêu",
      singer: "Hòa Minzy",
      path: "./assets/mp3/song4.mp3",
      image: "./assets/imgs/song4.png",
    },
    {
      name: "Ngủ một mình",
      singer: "Hieuthuhai",
      path: "./assets/mp3/song5.mp3",
      image: "./assets/imgs/song5.png",
    },
    {
      name: "One last time",
      singer: "Youtube",
      path: "./assets/mp3/song6.mp3",
      image: "./assets/imgs/song6.png",
    },
    {
      name: "The Vamp",
      singer: "Youtube",
      path: "./assets/mp3/song7.mp3",
      image: "./assets/imgs/song7.png",
    },
    {
      name: "Em đồng ý",
      singer: "Youtube",
      path: "./assets/mp3/song8.mp3",
      image: "./assets/imgs/song8.png",
    },
    {
      name: "Thị Mầu",
      singer: "Hòa Minzy",
      path: "./assets/mp3/song9.mp3",
      image: "./assets/imgs/song9.png",
    },
    {
      name: "Rebound",
      singer: "Tờ Ling",
      path: "./assets/mp3/song10.mp3",
      image: "./assets/imgs/song10.png",
    },
    {
      name: "Xui hay vui",
      singer: "Tờ Ling x MONO",
      path: "./assets/mp3/song11.mp3",
      image: "./assets/imgs/song11.png",
    },
    {
      name: "11:11",
      singer: "Youtube",
      path: "./assets/mp3/song12.mp3",
      image: "./assets/imgs/song12.png",
    },
    {
      name: "11:11(remix)",
      singer: "Youtube",
      path: "./assets/mp3/song13.mp3",
      image: "./assets/imgs/song13.png",
    },
  ],
  setConfig: function (key, value) {
    console.log(this.config);
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index = "${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>  `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    // xử lí phóng to thu nhỏ đĩa cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // xử lí khi cd quay/ dừng
    const keyframeCd = [
      {
        transform: "rotate(360deg)",
      },
    ];
    const optionCd = {
      duration: 10000,
      iterations: Infinity,
    };
    const cdAnimate = cdThumb.animate(keyframeCd, optionCd);
    console.log(cdAnimate);
    cdAnimate.pause();
    // xứ lí khi click nút play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi song playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdAnimate.play();
    };
    // khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdAnimate.pause();
    };
    // khi  tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // khi tua
    progress.oninput = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      cdAnimate.pause();
      if (_this.isPlaying) {
        setTimeout(function () {
          cdAnimate.play();
        }, 200);
      } else {
        cdAnimate.pause();
      }
    };
    // khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };
    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };
    // khi bật tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);

      randomBtn.classList.toggle("active", _this.isRandom);
      // khi random thì off repeat
      _this.isRepeat = false;

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    // xử lí khi repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);

      repeatBtn.classList.toggle("active", _this.isRepeat);
      // khi repeat thì off random
      _this.isRandom = false;

      randomBtn.classList.toggle("active", _this.isRandom);
    };
    // handle song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // lắng nghe khi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        //xứ lí khi click vào song
        if (songNode) {
          console.log(songNode.dataset.index);
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.activeSongs(_this.currentIndex);
          audio.play();
        }
        // xứ lí khi click vào song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  activeSongs: function (currentIndex) {
    const songDivs = $$(".song");
    $(".song.active").classList.remove("active");
    songDivs.forEach((song, index) => {
      if (index === currentIndex) {
        song.classList.add("active");
      }
    });
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.activeSongs(this.currentIndex);
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    this.activeSongs(this.currentIndex);
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (
      newIndex === this.currentIndex ||
      newIndex === this.currentIndex - 1 ||
      newIndex === this.currentIndex + 1
    );
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.activeSongs(this.currentIndex);
  },
  scrollToActiveSong: function () {
    var view;
    if (this.currentIndex < 2) {
      view = "end";
    } else {
      view = "center";
    }
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: view,
      });
    }, 500);
  },
  start: function () {
    // Render playlist
    this.render();
    // định nghĩa các thuộc tính cho object
    this.defineProperties();
    // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    // xử lí các sự kiện
    this.handleEvents();
  },
};

app.start();
