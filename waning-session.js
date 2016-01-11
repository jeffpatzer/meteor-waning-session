Meteor.startup(function(){
  var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningInactivityTimeout || 60*20; // 20 minutes
  var waningSessionModalTimeout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningSessionModalTimeout || 60; // 60 seconds
  var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningActivityEvents || 'mousemove click keydown touchstart';
  var masterRoles = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningMasterRoles || ['noWaningStandardLogout'];
  var debug = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningSessionDebug || false;

  if (debug){
    console.log("Waning Session");
    console.log("heartbeatInterval: " + heartbeatInterval);
    console.log("waningSessionModalTimeout: " + waningSessionModalTimeout);
    console.log("activityEvents: " + activityEvents);
  }

  var activityDetected = new moment();
  var hasBootstrap = (typeof $().modal == 'function');
  var modalOpen = false;
  ReactiveLocalStorage('WSActivity', true);
  var modalOpenTime;
  Session.set("waningSessionModalTimeoutTime", waningSessionModalTimeout);
  ReactiveLocalStorage('waningSessionLogMeOut', false);

  // Tracker.autorun(function () {
  //   console.log(ReactiveLocalStorage('waningSessionLogMeOut')) // reactivly log localStorage['key'] to the console.
  //   if (ReactiveLocalStorage('waningSessionLogMeOut')===true){
  //     Meteor.logout();
  //     Meteor.setTimeout(function(){
  //       ReactiveLocalStorage('waningSessionLogMeOut', false)
  //     },300)
  //   }
  // })

  Meteor.setInterval(function() {
    var timeBehind = moment().subtract(heartbeatInterval, 'seconds');
    var isOutOfBounds = timeBehind.isAfter(activityDetected);
    if (debug){
      console.log("Waning Session - Checking user activity");
      // console.log(ReactiveLocalStorage('waningSessionLogMeOut', false));
      console.log("[WS] Exempt Roles: "+masterRoles);
      console.log("[WS] "+timeBehind.toDate());
      console.log("[WS] "+activityDetected.toDate());
    }

    if (!Meteor.userId()){return;}

    if (masterRoles && Roles.userIsInRole(Meteor.userId(), masterRoles)){return;}

    if (isOutOfBounds && !modalOpen) {
      // remove the fade to make it instant, hide, add the class back
      $(".modal").removeClass("fade").modal("hide").addClass("fade");
      // show the modal
      $("#logoutModal").modal('show');
      modalOpen = true;
      modalOpenTime = new moment();
      Session.set("waningSessionModalTimeoutTime", waningSessionModalTimeout);
    }else
    if (modalOpen){
      Session.set("waningSessionModalTimeoutTime", Session.get("waningSessionModalTimeoutTime")-1);
      var modalTimeBehind = moment().subtract(waningSessionModalTimeout, 'seconds');
      var isAfterModalLogout = modalTimeBehind.isAfter(modalOpenTime);
      if (debug){
        console.log("Waning Session - Modal open");
        console.log("[WS] "+modalTimeBehind.toDate());
        console.log("[WS] "+modalOpenTime.toDate());
        console.log("[WS] "+activityDetected.toDate());
      }
      if (isAfterModalLogout){
        modalOpen=false;
        $("#logoutModal").modal('hide');
        $(".modal").removeClass("fade").modal("hide").addClass("fade");
        // logs out other windows
        // ReactiveLocalStorage('waningSessionLogMeOut', true);
        Match.setTimeout(function(){
          Meteor.logout();
        }, 300);
      }
    }
  }, 1000);

  //
  // detect activity and mark it as detected on any of the following events
  //
  $(document).on(activityEvents, function() {
    activityDetected = new moment();
    ReactiveLocalStorage('WSActivity', true);
  });


  Template.waningSessionLogoutModal.onRendered(function(){
    $("#stay-logged-in").on('click',function(e){
      activityDetected = new moment();
      modalOpen=false;
      $("#logoutModal").modal('hide');
    });
  });

});
