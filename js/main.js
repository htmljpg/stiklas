$(document).ready(function(){

    // menu responsive
    $('[data-target]').on('click', function(){
        var target = $(this).data("target");
        $(target).toggleClass('active').siblings('.overlay').toggleClass('active');
        if($(this).hasClass('hamburger')) {
            $('body').addClass('overflow-hidden');
        } else if($(this).hasClass('nav__close')) {
            $('body').removeClass('overflow-hidden');
        }
    });


    function FixHeader() {
        if ( $( window ).scrollTop() > 0 ) {
            $(".page__row--header").addClass("fixed");
        }
        else {
            $(".page__row--header").removeClass("fixed");
        }

        setTimeout( FixHeader, 100 );
    }

    $( FixHeader );

    // grid
    var $grid = $('.grid').isotope({
        itemSelector: '.grid__item',
        percentPosition: true,
        masonry: {
            columnWidth: '.grid__sizer'
        }
    });
    
    // layout Isotope after each image loads
    $grid.imagesLoaded().progress(function() {
        $grid.isotope('layout');
      });
      // external js: isotope.pkgd.js
      // init Isotope
      var iso = new Isotope('.grid', {
        itemSelector: '.grid__item',
      });
      // filter functions
      var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function(itemElem) {
          var number = itemElem.querySelector('.number').textContent;
          return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function(itemElem) {
          var name = itemElem.querySelector('.name').textContent;
          return name.match(/ium$/);
        }
      };
      // bind filter button click
      var filtersElem = document.querySelector('.grid-nav--filters');
      filtersElem.addEventListener('click', function(event) {
        // only work with buttons
        if (!matchesSelector(event.target, 'a')) {
          return;
        }
        var filterValue = event.target.getAttribute('data-filter');
        // use matching filter function
        filterValue = filterFns[filterValue] || filterValue;
        iso.arrange({
          filter: filterValue
        });
      });
      // change is-checked class on buttons
      var buttonGroups = document.querySelectorAll('.grid-nav');
      for (var i = 0, len = buttonGroups.length; i < len; i++) {
        var buttonGroup = buttonGroups[i];
        radioButtonGroup(buttonGroup);
      }
      
      function radioButtonGroup(buttonGroup) {
        buttonGroup.addEventListener('click', function(event) {
          // only work with buttons
          if (!matchesSelector(event.target, 'a')) {
            return;
          }
          buttonGroup.querySelector('.is-checked').classList.remove(
            'is-checked');
          event.target.classList.add('is-checked');
        });
      };

    // fancybox 3
    $('[data-fancybox="gallery"]').fancybox({
        
    });

    // select
    function create_custom_dropdowns() {
        $('select').each(function (i, select) {
            if (!$(this).next().hasClass('dropdown-select')) {
                $(this).after('<div class="dropdown-select wide ' + ($(this).attr('class') || '') + '" tabindex="0"><span class="current"></span><div class="list scroll-hidden"><div class="scroll-hidden scrollbar-inner"><ul></ul></div></div></div>');
                var dropdown = $(this).next();
                var options = $(select).find('option');
                var selected = $(this).find('option:selected');
                dropdown.find('.current').html(selected.data('display-text') || selected.text());
                options.each(function (j, o) {
                    var display = $(o).data('display-text') || '';
                    dropdown.find('ul').append('<li class="option ' + ($(o).is(':selected') ? 'selected' : '') + '" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
                });
            }
        });

        $('.dropdown-select ul').before('<div class="dd-search"><input id="txtSearchValue" autocomplete="off" onkeyup="filter()" class="dd-searchbox" type="text"></div>');
    }

    // Event listeners

    // Open/close
    $(document).on('click', '.dropdown-select', function (event) {
        if($(event.target).hasClass('dd-searchbox')){
            return;
        }
        $('.dropdown-select').not($(this)).removeClass('open');
        $(this).toggleClass('open');
        if ($(this).hasClass('open')) {
            $(this).find('.option').attr('tabindex', 0);
            $(this).find('.selected').focus();
        } else {
            $(this).find('.option').removeAttr('tabindex');
            $(this).focus();
        }
    });

    // Close when clicking outside
    $(document).on('click', function (event) {
        if ($(event.target).closest('.dropdown-select').length === 0) {
            $('.dropdown-select').removeClass('open');
            $('.dropdown-select .option').removeAttr('tabindex');
        }
        event.stopPropagation();
    });

    function filter(){
        var valThis = $('#txtSearchValue').val();
        $('.dropdown-select ul > li').each(function(){
         var text = $(this).text();
            (text.toLowerCase().indexOf(valThis.toLowerCase()) > -1) ? $(this).show() : $(this).hide();         
       });
    };
    // Search

    // Option click
    $(document).on('click', '.dropdown-select .option', function (event) {
        $(this).closest('.list').find('.selected').removeClass('selected');
        $(this).addClass('selected');
        var text = $(this).data('display-text') || $(this).text();
        $(this).closest('.dropdown-select').find('.current').text(text);
        $(this).closest('.dropdown-select').prev('select').val($(this).data('value')).trigger('change');
    });

    // Keyboard events
    $(document).on('keydown', '.dropdown-select', function (event) {
        var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
        // Space or Enter
        //if (event.keyCode == 32 || event.keyCode == 13) {
        if (event.keyCode == 13) {
            if ($(this).hasClass('open')) {
                focused_option.trigger('click');
            } else {
                $(this).trigger('click');
            }
            return false;
            // Down
        } else if (event.keyCode == 40) {
            if (!$(this).hasClass('open')) {
                $(this).trigger('click');
            } else {
                focused_option.next().focus();
            }
            return false;
            // Up
        } else if (event.keyCode == 38) {
            if (!$(this).hasClass('open')) {
                $(this).trigger('click');
            } else {
                var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
                focused_option.prev().focus();
            }
            return false;
            // Esc
        } else if (event.keyCode == 27) {
            if ($(this).hasClass('open')) {
                $(this).trigger('click');
            }
            return false;
        }
    });
    
    create_custom_dropdowns();

    // quantity buttons
    // $('.quantity__button--sub').click(function () {
	// 	var $input = $(this).parents('.quantity').find('input');
	// 	var count = parseInt($input.val()) - 1;
	// 	count = count < 1 ? 1 : count;
	// 	$input.val(count);
	// 	$input.change();
	// 	return false;
	// });
	// $('.quantity__button--add').click(function () {
	// 	var $input = $(this).parents('.quantity').find('input');
	// 	$input.val(parseInt($input.val()) + 1);
	// 	$input.change();
	// 	return false;
    // });

    var stepper = function () {
        var stepperNumber,
            subButton;
        
        return {
          
          allSteppers: $( '.input-stepper' ),
        
          // check to see if the input is at '1'...
          checkStepperNumber: function ( thisStepper ) {
            stepperInput = $( thisStepper ).find( 'input' );
            stepperNumber = stepperInput.val();
            decrementButton = $( thisStepper ).find( 'button.sub' );
      
            if ( stepperNumber === '1' || stepperNumber <= 1 ) {
              // if so, disable the sub button. 
              decrementButton.prop( 'disabled', true );
              stepperInput.val( 1 );
            } else {
              // if number is positive, enable the sub button
              decrementButton.prop( 'disabled', false );
            }
      
          },
      
          init: function () {
            stepper.allSteppers.each( function ( index, element ) {
              var thisStepperInput = $( element ).find( 'input' );
              var thissubButton = $( element ).find( 'button.sub' );
      
              if ( thisStepperInput.val() === '1' || thisStepperInput.val() <= 1 ) {
                thissubButton.prop( 'disabled', true );
                thisStepperInput.val( 1 );
              } else {
                // if number is positive, enable the sub button
                thissubButton.prop( 'disabled', false );
              }
            });
          }
          
        }
      }();
      
      // on button.add click ...
      $( '.input-stepper button.add' ).on( 'click', function ( e ) {
        thisStepper = $( e.target ).closest( '.input-stepper' );
        stepperInput = thisStepper.find( 'input' );
        
        // check the input value
        stepperNumber = stepperInput.val();
        
        // increment the input value
        stepperNumber++;
        stepperInput.val( stepperNumber );
        
        // then check the stepper number
        stepper.checkStepperNumber( thisStepper );
      });
      
      // on button.sub click ...
      $( '.input-stepper button.sub' ).on( 'click', function ( e ) {
        thisStepper = $( e.target ).closest( '.input-stepper' );
        stepperInput = thisStepper.find( 'input' );
        
        // check the input value
        stepperNumber = stepperInput.val();
        
        // decrement the input value
        stepperNumber--;
        stepperInput.val( stepperNumber );
        
        // then check the stepper number
        stepper.checkStepperNumber( thisStepper );
      });
      
      // on input field blur ...
      $( '.input-stepper input' ).on( 'blur', function ( e ) {
        thisStepper = $( e.target ).closest( '.input-stepper' );
        // check the stepper number
        stepper.checkStepperNumber( thisStepper );
      });
      
      // check the stepper number on load
      if ( $( '.input-stepper' ).length ) {
        stepper.init();
       }

    // Swiper
    mySwiper = new Swiper('.swiper-container--reviews', {
        slidesPerView: 'auto',
        simulateTouch: false,
        watchOverflow: true,
        watchSlidesVisibility: true,
        cssMode: false,
        loop: false,
        speed: 1000,
        navigation: {
        nextEl: '.next',
        prevEl: '.prev',
    },
        pagination: {
        el: '',
        clickable: true,
    },
        mousewheel: {
        forceToAxis: true,
    },
        touchReleaseOnEdges: true,
        keyboard: false,
        breakpoints: {
            
        }
    });
    mySwiper = new Swiper('.swiper-container--partners', {
        slidesPerView: 'auto',
        simulateTouch: false,
        watchOverflow: true,
        watchSlidesVisibility: true,
        cssMode: false,
        loop: false,
        navigation: {
        nextEl: '.next',
        prevEl: '.prev',
    },
        pagination: {
        el: '',
        clickable: true,
    },
        mousewheel: {
        forceToAxis: true,
    },
    autoplay: 
    {
      delay: 3000,
    },
    loop: true,
    touchReleaseOnEdges: true,
    keyboard: false,
        breakpoints: {
            
        }
    });
    mySwiper = new Swiper('.swiper-container--certificates', {
        slidesPerView: 'auto',
        simulateTouch: false,
        watchOverflow: true,
        watchSlidesVisibility: true,
        cssMode: false,
        loop: false,
        navigation: {
        nextEl: '.next',
        prevEl: '.prev',
    },
        pagination: {
        el: '',
        clickable: true,
    },
        mousewheel: {
        forceToAxis: true,
    },
    autoplay: 
    {
      delay: 3000,
    },
    loop: true,
        touchReleaseOnEdges: true,
        keyboard: false,
        breakpoints: {
            
        }
    });

    //modal
    $('.js-btn-modal').on('click', function(event){
        event.preventDefault();
        $('body').addClass('overflow-hidden');
        $('#overlay').fadeIn();
        var id = $(this).data('id');
        $('.js-modal[data-id="modal' + id + '"]').fadeIn().addClass('active');
    });
      
    $('.js-close-btn').on('click', function(){
        $('body').removeClass('overflow-hidden');
        $('#overlay').fadeOut();
        $('.js-modal').fadeOut().removeClass('active');
    });
    $('#overlay').on('click', function(){
        $('body').removeClass('overflow-hidden');
        $('#overlay').fadeOut();
        $('.js-modal').fadeOut().removeClass('active');
    });   
    
    // Form validate
    $('form').each(function() {
        $(this).validate({
            highlight: function(element) {
                $(element).addClass('error');
            },
            unhighlight: function(element) {
                $(element).removeClass('error');
            },
            errorClass: 'form__error',
            errorElement: 'div',
            rules: {
                userName: {
                    required: true,
                },
                userEmail: {
                    required: true,
                },
                userTel: {
                    required: true,
                },
            },
            messages: {
                userName: {
                    required: 'Заполнить поле Имя',
                },
                userEmail: {
                    required: 'Заполнить поле E-mail',
                    email: 'Введите точный E-mail',
                },
                userTel: {
                    required: 'Заполнить поле Телефон',
                },
            }
        });
    });

    // mask
    $('input[type="tel"]').mask('+7 (999) 999-99-99');

    // scrollbar
    $('.scrollbar-inner').scrollbar();

    // up btn
    var btn = $('#up');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
    });


    // header fixed nav
    $(window).scroll(function(){
        var $sections = $('.page__row');
        $sections.each(function(i,el){
            var top  = $(el).offset().top-$(".page__row--header").height() - 10;
            var bottom = top +$(el).height();
            var scroll = $(window).scrollTop();
            var id = $(el).attr('id');
            if( scroll > top && scroll < bottom && scroll > 0){
                $('.target-nav a.active').removeClass('active');
                $('.target-nav a[href="#'+id+'"]').addClass('active');

            }
        })
     });

    $(".target-nav").on("click","a", function (event) {
        event.preventDefault();
        
        var id  = $(this).attr('href'),

            top = $(id).offset().top;

        $('body,html').animate({scrollTop: top - $(".page__row--header").height()}, 800);
    });

});