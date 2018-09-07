document.addEventListener("DOMContentLoaded", function() {
    let Model = function() {
        this.servicesTop = 0;
		this.scroll = 0;
		
		this.menuVisible = false;
		this.skillsChartSettings = {
			radius: 90,
			value: 0,
			maxValue: 100,
			width: 15,
			text: () => null,
			colors: ['#000000', '#802775'],
			duration: 400,
			wrpClass: 'circles-wrp',
			valueStrokeClass: 'circles-valueStroke',
			maxValueStrokeClass: 'circles-maxValueStroke'
		};

    }

    let View = function(model) {
		//-- menu related selectors
		this.SECTIONS = document.querySelectorAll("section");
		this.MENU = document.querySelector('.menu');
		this.MENU_TOGGLE_MAIN = document.querySelector('.menu-toggle--main');
		this.MENU_TOGGLE = document.querySelectorAll('.menu-toggle');
		this.MENU_BTNS = document.querySelectorAll(".menu__item");
		
		//-- back-to-top related selectors
        this.ARROW = document.querySelector('.arrow');
        this.HEADER = document.querySelector('header');
        this.SECTION_SERVICES = document.querySelector('section.services');
		this.TO_TOP = document.querySelector('.back-to-top');
		
		//-- carousel selectors
		this.CAROUSEL = document.querySelector('.carousel');
		this.CAROUSEL_PREV = document.querySelector('#prev');
		this.CAROUSEL_NEXT = document.querySelector('#next');

		//-- scroll related selectors
		this.SKILLS_CHARTS = document.querySelector('.skills__flex-container');
		this.SERVICES = document.querySelectorAll('.service');
    }
	
    let Controller = function(model, view) {
		//-- helper functions
		this.moveToTop = () => {
			model.scroll = 0;
			window.scroll({
				top: model.scroll,
				left: 0,
				behavior: 'smooth'
			});
		};
		
		this.menuHandler = () => {
			if (model.menuVisible) {
				view.MENU.classList.remove('visible');
				model.menuVisible = false;				
				view.MENU_TOGGLE_MAIN.classList.add('visible')
			} else {
				view.MENU.classList.add('visible');
				model.menuVisible = true;
				view.MENU_TOGGLE_MAIN.classList.remove('visible')
			}
		};

		//-- scroll related behavior functions
		this.skillsAnimationUp = () => {
			skillsPhotoshop.update(70, 600);
			skillsFireworks.update(90, 600);
			skillsHTML.update(60, 600);
			skillsWordpress.update(40, 600);
		};

		this.skillsAnimationDown = () => {
			skillsPhotoshop.update(0, 400);
			skillsFireworks.update(0, 400);
			skillsHTML.update(0, 400);
			skillsWordpress.update(0, 400);
		};

		this.hideServices = () => {
			view.SERVICES.forEach(el => {
				let transition = el.dataset.js === "left" ? "-1000px" : "1000px";
				el.style.transform = `translateX(${transition})`;
				el.style.opacity = 0;
			});
		}
		this.showServices = () => {
			view.SERVICES.forEach(el => {
				el.style.transform = "translateX(0)";
				el.style.opacity = 1;
			});
		}
		//-- handler functions
        this.arrowHandler = () => {
            model.servicesTop = view.SECTION_SERVICES.offsetTop;
            window.scroll({
                top: model.servicesTop,
                left: 0,
                behavior: 'smooth'
            });
        };

        this.scrollHandler = () => {
			//-- function which aggregates behavior of various elements on scroll
			model.scroll = window.scrollY;
            model.scroll > view.HEADER.offsetHeight/2 ?
                view.TO_TOP.classList.add('visible')
            :
                view.TO_TOP.classList.remove('visible');
			
			model.scroll > view.SKILLS_CHARTS.offsetTop - window.innerHeight ?
				this.skillsAnimationUp() : this.skillsAnimationDown();

			model.scroll > view.SECTION_SERVICES.offsetTop - window.innerHeight ? this.showServices() : this.hideServices();
        };

		this.menuClickHandler = (e) => {
			e.preventDefault();
			let data = e.target.dataset.js;
			let el = [...view.SECTIONS].filter(el => el.classList.contains(data));
			let offset = el[0].offsetTop;
			window.scroll({
				top: offset,
				left: 0,
				behavior: 'smooth'
			});
			window.innerWidth < 500 ? this.menuHandler() : null;
		};

		this.closeMenu = (e) => {
			let condition1 = !e.target.classList.contains('menu');
			let condition2 = !e.target.classList.contains('menu-toggle');
			let condition3 = model.menuVisible;
			let condition4 = !e.target.classList.contains('fa-bars');

			if (condition1 && condition2 && condition3 && condition4) { 
					view.MENU.classList.remove('visible');
					model.menuVisible = false;
					view.MENU_TOGGLE_MAIN.classList.add('visible')
			}
		}

	//-- event listeners
		
		//-- listener for menu items
		view.MENU_BTNS.forEach(element => {
			element.addEventListener('click', (e) => this.menuClickHandler(e));
		});
		//-- listener for closing menu when clicked anywhere on screen
		document.body.addEventListener('click', (e) => this.closeMenu(e));

		//listener for menu toggling
		view.MENU_TOGGLE.forEach(el => el.addEventListener('click', this.menuHandler));

        view.ARROW.addEventListener('click', this.arrowHandler);
        window.addEventListener('scroll', this.scrollHandler);
		view.TO_TOP.addEventListener('click', this.moveToTop);

		
		
	//-- libraries initialisation
		//-- Flickity.js
		let flkty = new Flickity(view.CAROUSEL, {
			cellAlign: 'left',
			draggable: true,
			contain: true,
			wrapAround: true,
			prevNextButtons: false,
			pageDots: false
		});

		view.CAROUSEL_PREV.addEventListener("click", () => flkty.previous(true));
		view.CAROUSEL_NEXT.addEventListener("click", () => flkty.next(true));

		//--  Circles.js
		let skillsPhotoshop = Circles.create({ ...model.skillsChartSettings, id: 'photoshop-chart' });
		let skillsFireworks = Circles.create({ ...model.skillsChartSettings, id: 'fireworks-chart' });
		let skillsHTML = Circles.create({ ...model.skillsChartSettings, id: 'html-chart' });
		let skillsWordpress = Circles.create({ ...model.skillsChartSettings, id: 'wordpress-chart' });


	//--initialisation function calls
		this.hideServices();

    }

    let model = new Model();
    let view = new View(model);
    let controller = new Controller(model, view);

  });