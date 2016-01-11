# Waning Session

Logs out a user a specified period of inactivity. Done all client-side.

It works by tracking any of the following events on the body tag of the document.

* `mousemove`
* `click`
* `keydown`
* `touchstart`

These can be further configured if need be.

You can configure the following options for timeout and

```json
{
  "public": {
    "waningInactivityTimeout": 1200, // seconds
    "waningSessionModalTimeout": 60, // seconds
    "waningActivityEvents": "mousemove click keydown touchstart",
    "waningMasterRoles": "dontLogOutThisRole"
  }
}
```

Include the following template somewhere that is accessible across the setInterval

```
{{> waningSessionLogoutModal}}
```

You can customize the modal with the following attributes

```
{{#waningSessionLogoutModal title="Your Title" button="Your Button Text"}}
  <p>Content Block</p
{{/waningSessionLogoutModal}}
```
Otherwise defaults are used.

Requires a bootstrap modal package in order to work. There are quite a few options that can be used.

* https://atmospherejs.com/twbs/bootstrap
* https://atmospherejs.com/peppelg/bootstrap-3-modal

Some inspiration taken from (stale-session)[https://github.com/lindleycb/meteor-stale-session].

To use debug output

```
{
  "public": {
    waningSessionDebug: true
  }
}
```


_TODO_

* Configure timeout based on roles using (meteor-roles package)[https://github.com/alanning/meteor-roles]
