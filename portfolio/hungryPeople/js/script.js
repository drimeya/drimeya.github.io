'use strict';

document.addEventListener('DOMContentLoaded', function () {
  function scroll() {
    const links = document.querySelectorAll('a[href*="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href');
        document.querySelector(`${id}`).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      });
    });
  }
  scroll();

  function scrollUp(selector, height) {
    const up = document.querySelector(selector);

    document.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > height) {
        up.style.display = 'block';
      } else {
        up.style.display = 'none';
      }
    });
  }
  scrollUp('.down_up', 1000);

  function hamburger() {
    const hamburger = document.querySelector('.hamburger'),
          nav = document.querySelector('.nav'),
          ul = nav.querySelector('ul'),
          navItems = nav.querySelectorAll('.nav__item');

    hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav_active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        nav.classList.remove('nav_active');
      });
    });

    document.addEventListener('click', (e) => {
      if (e.target != ul && e.target != hamburger) {
        nav.classList.remove('nav_active');
      }
    });
  }
  hamburger();

  function showSocial() {
    const trigger = document.querySelector('.social__arrow'),
          social = document.querySelector('.social');

    trigger.addEventListener('click', () => {
      social.classList.toggle('social_active');
    });

    document.addEventListener('click', (e) => {
      if (e.target != social && e.target != trigger) {
        social.classList.remove('social_active');
      }
    });
  }
  showSocial();

  async function getResource(url, parent) {
    let res = await fetch(url);

    if (!res.ok) {
        document.querySelector(parent).innerHTML = `Something went wrong`;
        document.querySelector(parent).classList.add('error');
    }

    return await res.json();
  }

  function menu() {
    getResource('database/menu.json', '.menu__content')
    .then(data => {
      const tabParent = document.querySelector('.tabs'),
            tab = document.querySelectorAll('.tab'),
            tabContent = document.querySelector ('.menu__tab');
      
      function createMenuItems(key) {
        let currentTab = data[key];

        currentTab.forEach (item => {
          const menuItem = document.createElement('div');
          menuItem.classList.add('menu__item');

          menuItem.innerHTML = `
            <h3 class="menu__item-name">${item.name}</h3>
            <p class="menu__item-descr">${item.descr}</p>
            <div class="menu__item-price">${item.price}</div>
          `;
          tabContent.append(menuItem);
        });
      }
      createMenuItems('soupe');
      
      tabParent.addEventListener('click', (event) => {
        if (!event.target.classList.contains('.tab')) {
          tab.forEach(item => {
            item.classList.remove('tab_active');
          });
          event.target.classList.add('tab_active');

          tabContent.innerHTML = '';
          for (let key in data) {
            if (key == event.target.innerHTML) {
              createMenuItems(key);
            }
          }
        }
      });
    });
  }
  menu();

  //slider (на сервере)

  function slider() {
    const sliderWrap = document.querySelector('.slider'),
        dotsCreate = document.createElement('div');
    let dots;

    getResource('database/slides.json', '.slider')
    .then(data => {
      const slides = data.slides;
      return slides;
    })
    .then(data => {
      function createDots() {
        dotsCreate.classList.add('slider__dot-wrapper');
    
        sliderWrap.after(dotsCreate);
        for (let i = 0; i < data.length; i++) {
          let dot = document.createElement('div');
          dotsCreate.append(dot);
          dot.classList.add('slider__dot');
          if (i === 0) {
            dot.classList.add('slider__dot_active');
          }
        }
      }
      createDots();

      function createSlide(i) {
        if (i % 2 === 0 || i === 0) {
          sliderWrap.innerHTML = `
            <div class="slider__item">
              <div class="specialtes__item">
                  <div class="image-wrapper image-wrapper_left">
                      <div class="yellow-square yellow-square_left"></div>
                      <picture><source srcset="${data[i].picture.slice(0, -3) + 'webp'}" type="image/webp"><img src="${data[i].picture}img/specialties-img.jpg" alt="specialtes-img"></picture>
                  </div>
                  <div class="text-wrapper text-wrapper_right white-text">
                      <h2 class="title">${data[i].name}</h2>
                      <div class="divider"></div>
                      <p class="text text_mt14">
                          <span>${data[i].boldDescr}</span>
                          <br><br>
                          ${data[i].descr}
                      </p>
                  </div>
              </div>
            </div>
          `;
        } else {
          sliderWrap.innerHTML = `
          <div class="slider__item">
            <div class="specialtes__item">
              <div class="text-wrapper white-text">
                <h2 class="title">${data[i].name}</h2>
                <div class="divider"></div>
                <p class="text text_mt14">
                    <span>${data[i].boldDescr}</span>
                    <br><br>
                    ${data[i].descr}
                </p>
              </div>
              <div class="image-wrapper">
                <div class="yellow-square"></div>
                <picture><source srcset="${data[i].picture.slice(0, -3) + 'webp'}" type="image/webp"><img src="${data[i].picture}" alt="specialtes-img"></picture>
            </div>
            </div>
          </div>
          `;
        } 
      }
      createSlide(0);

      function dotsSwitch(item) {
        dots.forEach(x => {
          x.classList.remove('slider__dot_active');
        });

        item.classList.add('slider__dot_active');
      }

      function switcher() {
        dots = document.querySelectorAll('.slider__dot');

        dots.forEach((item, i) => {
          item.addEventListener('click', () => {
            dotsSwitch(item);

            createSlide(i);
          });
        });
      }
      switcher();

      function sliderAutoplay() {
        let i = 1;

        function changeSlide() {
          if (i === data.length) {
            i = 0;
          }
          dotsSwitch(dots[i]);
          createSlide(i);
          i++;
        }

        let timer = setInterval(changeSlide, 5000);

        dots.forEach(item => {
          item.addEventListener('click', () => {
            clearInterval(timer);

            timer = setInterval(changeSlide, 5000);
          });
        });
      }

      sliderAutoplay();
    });
  }
  slider();

  function gallery() {
    const galleryWrap = document.querySelector('.gallery'),
          galleryItems = galleryWrap.querySelectorAll('img'),
          overlay = document.querySelector('.overlay'),
          modalContent = document.querySelector('.modal__content'),
          close = document.querySelector('.modal__close');


    function showHint() {
      const overlayImg = document.createElement('div');

      overlayImg.classList.add('overlay-img');

      galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.before(overlayImg);
        });
      });
  
      galleryItems.forEach(item => {
        item.addEventListener('mouseleave', () => {
          overlayImg.remove();
        });
      });
    }
    
    function showGallery() {
      galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => {
          overlay.classList.add('active');

          if (i >= 4) {
            i = i - 4;
            modalContent.innerHTML = `<picture><source srcset="img/gallery/carousel/gallery-big-${i + 1}.webp" type="image/webp"><img src="img/gallery/carousel/gallery-big-${i + 1}.jpg" alt="${i + 1}"></picture>`;
          } else {
            modalContent.innerHTML = `<picture><source srcset="img/gallery/carousel/gallery-big-${i + 1}.webp" type="image/webp"><img src="img/gallery/carousel/gallery-big-${i + 1}.jpg" alt="${i + 1}"></picture>`;
          }

          document.body.style.height = '100nh';
          document.body.style.overflow = 'hidden';
        });
      });
    }

    function closeGallery() {
      function closeModal(closeTrigger, overlayLayer) {
        closeTrigger.addEventListener('click', () => {
          overlayLayer.classList.remove('active');
          document.body.style.height = '';
          document.body.style.overflow = '';
          modalContent.innerHTML = '';
        });
      }

      closeModal(close, overlay);
      closeModal(overlay, overlay);
    }
  
    showHint();
    showGallery();
    closeGallery();
  }
  gallery();

  function sentForm() {
    const forms = document.querySelectorAll('form'),
        overlay = document.querySelector('.overlay'),
        modal = document.querySelector('.modal'),
        content = modal.querySelector('.modal__content'),
        messages = {
          success: 'Thank you! We will contact you during the day',
          loading: 'Loading...',
          error: 'Something went wrong'
        };

    function createModal() {
      overlay.classList.add('active');
      modal.classList.add('modal_form');
    }

    function modalTimeOut() {
      setTimeout(() => {
        overlay.classList.add('overlay_slideOut');
      }, 3000);
      setTimeout(() => {
        overlay.classList.remove('active');
        overlay.classList.remove('overlay_slideOut');
        modal.classList.remove('modal_form');
        content.innerHTML = '';
      }, 3280);
    }
    forms.forEach( form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);

        let  obj = {};
        formData.forEach( (value, key) => {
          obj[key] = value;
        });

        fetch('server.php', {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(data => data.text())
        .then(data => {
          console.log(data);
          createModal();
          content.innerHTML = messages.loading;
        })
        .then(() => {
          content.innerHTML = messages.success;
        })
        .catch( () => {
          content.innerHTML = messages.error;
        })
        .finally(() => {
          form.reset();
          modalTimeOut();
        });
      });
    });
  }
  sentForm();

});
