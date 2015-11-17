Meteor.startup(function(){
  var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningInactivityTimeout || 60*20; // 20 minutes
  var waningSessionModalTimeout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningSessionModalTimeout || 60; // 60 seconds
  var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningActivityEvents || 'mousemove click keydown touchstart';
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
  Session.set("waningSessionModalTimeoutTime", waningSessionModalTimeout)

  Meteor.setInterval(function() {
    var timeBehind = moment().subtract(heartbeatInterval, 'seconds');
    var isOutOfBounds = timeBehind.isAfter(activityDetected);
    if (debug){
      console.log("Waning Session - Checking user activity");
      console.log("[WS] "+timeBehind.toDate());
      console.log("[WS] "+activityDetected.toDate());
    }

    if (!Meteor.userId()){return;}

    if (isOutOfBounds && !modalOpen) {
      $("#logoutModal").modal('show');
      modalOpen = true;
    }else
    if (modalOpen){
      Session.set("waningSessionModalTimeoutTime", Session.get("waningSessionModalTimeoutTime")-1);
      var modalTimeBehind = moment().subtract(waningSessionModalTimeout, 'seconds');
      var isAfterModalLogout = modalTimeBehind.isAfter(activityDetected);
      if (debug){
        console.log("Waning Session - Modal open");
        console.log("[WS] "+modalTimeBehind.toDate());
        console.log("[WS] "+activityDetected.toDate());
      }
      if (isAfterModalLogout){
        modalOpen=false;
        $("#logoutModal").modal('hide');
        Meteor.setTimeout(function(){
          Meteor.logout();
        }, 500);
      }
    }
  }, 1000);

  //
  // detect activity and mark it as detected on any of the following events
  //
  $(document).on(activityEvents, function() {
    activityDetected = new moment();
  });


  Template.waningSessionLogoutModal.onRendered(function(){
    $("#stay-logged-in").on('click',function(e){
      activityDetected = new moment();
      modalOpen=false;
      $("#logoutModal").modal('hide');
    });
  });

});
