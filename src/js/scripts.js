(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    // FireShell

    /*video script start*/
    $('.main-video').on('canplaythrough', function () {
      $('.main-video').show();
    });
    /*video script end*/

    /*svg logo - path animation*/
    function ShowLogo() {
      $('#logo-fill').css('opacity', '1');
    }


    /*if the svg logo exists, animate it*/
    if ($('#svg-logo').length) {
      new Vivus('logo-path', {duration: 200}, ShowLogo);
    }


    /*get json - start*/

    /*perks build*/
    if ($('#perks-container').length) {

      $.getJSON('../api/perks.json', function (json) {

        /*loop through the arrays objects*/
        for (var i = 0; i < json.length; i++) {

          var perksMarkup = '<div class="perk-item"><div class="inner"><span>' + json[i].perk + '</span></div><div class="hidden">' + json[i].description + '</div></div>';


          /*inject elements into teams container*/
          $('#perks-container .perks').append(perksMarkup);

        }
      });

    }

    /*values build*/
    if ($('#values-container').length) {

      $.getJSON('../api/values.json', function (json) {

        /*loop through the arrays objects*/
        for (var i = 0; i < json.length; i++) {

          var valuesMarkup = '<div class="value-item"><div class="inner"><span>' + json[i].value + '</span></div><div class="hidden">' + json[i].description + '</div></div>';


          /*inject elements into teams container*/
          $('#values-container .values').append(valuesMarkup);

        }
      });

    }

    /*pull in teams*/
    if ($('#teams-container').length) {

      $.getJSON('../api/teams.json', function (json) {

        /*loop through the arrays objects*/
        for (var i = 0; i < json.length; i++) {

          var teamsMarkup = '<div class="team-item"><div class="inner"><span>' + json[i].team + '</span></div><span class="view-jobs">view jobs</span><div class="hidden">' + json[i].description + '</div></div>';


          /*inject elements into teams container*/
          $('#teams-container .teams').append(teamsMarkup);

        }
      });

    }


    /*pull in available jobs for filtering*/
    if ($('#vacancies-container').length) {
      /*$.getJSON('../api/jobs.json', function (json) {

       /!*loop through the arrays objects*!/
       for (var i = 0; i < json.length; i++) {

       var positionMarkup = '<div class="position"><div class="inner"><h1>' + json[i].positionTitle + '</h1><span>' + json[i].team + '</span><p>' + json[i].description + '</p></div></div>';

       /!*inject elements into filter container*!/
       $('#jetsContent').append(positionMarkup);

       /!*update the filter so it knows that elements have been added*!/
       jet.update();

       }
       });*/



      // Get a reference to the database service
      var database = firebase.database();

      /*reference the name of the firebase databse object. .once takes a snapshot of the data because we assume the data wont need to be updated in real time
      * .then is the promise to do something once data is retrieved*/
      database.ref('vacancies').once('value').then(function(snapshot){

        console.log(snapshot.val());

        $('.loading').css('display', 'none');


        /*firebase for loop*/
        snapshot.forEach(function(childSnapshot){

          /*console.log(childSnapshot.val());*/

          /*reference the values within the object*/
          var obj = childSnapshot.val();

          /*create the corresponding markup for each object*/
          var positionMarkup = '<div class="position"><div class="inner"><h1>' + obj.positionTitle + '</h1><span>' + obj.team + '</span><p>' + obj.description + '</p></div></div>';

          /*inject markup into jet filter*/
          $('#jetsContent').append(positionMarkup);

          /*update the jet filter so filtering works with new content*/
          jet.update();

        });

      });

    }

    /*get json - end*/


    /*filter init start*/
    if ($('#vacancies-container').length) {
      var jet = new Jets({
        searchTag: '#jetsSearch',
        contentTag: '#jetsContent'
      });
    }
    /*filter init end*/


    $('#teams-container').on('click', '.team-item .inner', function () {


      $('.popup-container').css('display', 'block');

      var TeamDetails = '<h1>' + $(this).find(':first-child').text() + '</h1>' +
        '<p>' + $(this).parent().find(':nth-child(3)').text() + '</p>' +
        '<button id="jobSearch">view jobs</button>';

      $('.popup-container .popup-content').html(TeamDetails);


      $('#jobSearch').click(function () {
        $('#vacancies-container input').val($(this).parent().children(':first-child').text());

        $('.popup-container').css('display', 'none');

        $('html, body').animate({
          scrollTop: $('#vacancies-container').offset().top
        }, 500);

        jet.search();

      });

    });

    /*filter jobs based on team click start*/
    $('#teams-container').on('click', '.team-item .view-jobs', function () {

      $('#vacancies-container input').val($(this).parent().children(':first-child').children(':first-child').text());


      $('html, body').animate({
        scrollTop: $('#vacancies-container').offset().top
      }, 500);

      jet.search();

    });
    /*filter jobs based on team click start*/

    /*populate popup based on job spec start*/
    $('#vacancies-container').on('click', '.inner', function () {

      $('.popup-container').css('display', 'block');

      var positionDetails = '<h1>' + $(this).find(':first-child').text() + '</h1>' +
        '<p>' + $(this).find(':nth-child(3)').text() + '</p>' +
        '<button id="jobApply">apply</button>';

      $('.popup-container .popup-content').html(positionDetails);

      /*popuplate form fields when apply for job is clicked start*/
      $('#jobApply').click(function () {
        console.log($(this).parent().find(':first-child').text());
        $('#icon_position').val($(this).parent().find(':first-child').text());
        $('.popup-container').css('display', 'none');
        $('html, body').animate({
          scrollTop: $('#careers-apply').offset().top
        }, 500);
        $('#icon_position').focus();
        $('#icon_prefix_first-name').focus();


      });
      /*populate form fields when apply for job is clicked end*/

    });
    /*populate popup based on job spec start*/


    /*values popup*/
    $('.values').on('click', '.inner', function () {
      console.log('values');
    });


    /*close popup*/
    $('.popup-container .popup-inner .close').click(function () {
      $('.popup-container').css('display', 'none');
    });


    /*view all jobs*/
    $('.view-all-jobs').click(function () {
      $('#vacancies-container input').val('');

      jet.search();
    });


    /*slick slider*/
    $('.slides').slick({
      autoplay: true,
      slidesToScroll: 1,
      autoplaySpeed: 3000,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
    });


    /*isotope*/
    $('.grid').isotope({
      masonry: {
        columnWidth: 100,
        fitWidth: true
      },
      itemSelector: '.grid-item'
    });


  });

})(jQuery, window, document);

