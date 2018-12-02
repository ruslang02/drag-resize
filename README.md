# Drag-resize JS library

For moving and resizing elements, only VanillaJS, maximum performance

Electron is _not_ required.

###Brief usage info

**new DragResize(element, options)**

 - element - DOMNode to make draggable and resizable
 - options
 
   - handle - selector of nodes to trigger draggable _!important_
   - cancel - selector of nodes that cancel triggering drag
   - triggerSize - _integer_, size in PX of resize triggers
 
###Example
```html
<body>
<window>
  <window-header>Hey, this is a title</window-header>
  <window-body>
    I am not triggering drag
    <div id="forceDrag">But I do!</div>
  </window-body>
</window>
<style>
#forceDrag {width:50px;height:50px;border:2px solid black;}
</style>
<script src="dragresize.js"></script>
<script src="my.js"></script>
</body>
```
```javascript
new DragResize(document.querySelector("window"), {
  cancel: "window-body",
  handle: "#forcedrag",
  triggerSize: 10 //px
})
```