Meteor.startup(function(){
  var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningInactivityTimeout || 60*20; // 20 minutes
  var modalTimeout = heartbeatInterval + (Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningInactivityTimeout || 60); // 60 seconds
  var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.waningActivityEvents || 'mousemove click keydown touchstart';
  var activityDetected = new moment();
  var hasBootstrap = (typeof $().modal == 'function');
  var modalOpen = false;
  Session.set("waningSessionModalTimeoutTime", modalTimeout)

  Meteor.setInterval(function() {
    var timeBehind = moment().subtract(heartbeatInterval, 'seconds');
    var isOutOfBounds = timeBehind.isAfter(activityDetected);

    if (!Meteor.userId()){return;}

    if (isOutOfBounds && !modalOpen) {
      $("#logoutModal").modal('show');
      modalOpen = true;
    }else
    if (modalOpen){
      Session.set("waningSessionModalTimeoutTime", Session.get("waningSessionModalTimeoutTime")-1);
      var modalTimeBehind = moment().subtract(modalTimeout, 'seconds');
      var isAfterModalLogout = modalTimeBehind.isAfter(activityDetected);
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
