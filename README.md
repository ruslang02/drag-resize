# Drag-resize JS library

For moving and resizing elements, only VanillaJS, maximum performance

Electron is _not_ required.

### Brief usage info

**new Draggable(element, options)**

 - element - DOMNode to make draggable
 - options
 
   - handle - selector of nodes to trigger draggable _!important_
   - cancel - selector of nodes that cancel triggering drag
 
**new Resizable(element, options)**

 - element - DOMNode to make resizable
 - options
 
   - triggerSize - _integer_, size in PX of resize triggers
   - edges: {top: _bool_, left: _bool_, right: _bool_, bottom: _bool_}, controls where to put triggers
### Example
```html
<body>
<div id="window">
  <header>Hey, this is a title</header>
  <main>
    I am not triggering drag
    <div id="forceDrag">But I do!</div>
  </main>
</div>
<style>
#forceDrag {width:50px;height:50px;border:2px solid black;}
</style>
<script src="dragresize.js"></script>
<script src="my.js"></script>
</body>
```
```javascript
new Draggable(document.querySelector("#window"), {
  cancel: "main",
  handle: "#dragArea"
});
new Resizable(document.querySelector("#window"), {
  edges: {
    top: true,
    left:true,
    bottom:true,
    right:true
  }
});
```