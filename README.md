# CSS-Directives  

**CSS-Directives** is a lightweight JavaScript library that simplifies styling HTML elements using custom directives. By adding attributes prefixed with `css:`, you can easily apply reusable styles or inline CSS rules directly in your HTML.  

---

## **Table of Contents**
1. [Features](#features)  
2. [Browser Support](#browser-support) 
3. [Installation](#installation)  
4. [Getting Started](#getting-started)  
5. [Usage Examples](#usage-examples)  
6. [Credits](#credits)  

---

## **Features**
- **Custom Directives**: Define reusable styles with `CssDirectives.register`.  
- **Dynamic Parsing**: Automatically detects and applies styles from HTML attributes prefixed with `css:`.  
- **Direct Inline Styling**: Use attributes like `css:color` or `css:font-size` to directly set CSS properties.  
- **Reusable Combinations**: Apply multiple directives using `css:attach`.  
- **Lightweight and Fast**: Designed to work seamlessly in modern web applications.  

---

## **Browser Support**

The library works with modern browsers supporting ES6 features:  

| Browser         | Version      |
|------------------|--------------|
| Chrome          | 60+          |
| Firefox         | 54+          |
| Edge            | 15+          |
| Safari          | 11+          |
| Opera           | 47+          |

For older browsers, polyfills for ES6 features like `Object.entries` and `Array.from` may be required.

---

## **Installation**
Simply add the library to your project by including the `css-directives.js` file:  

### **HTML**
```html
<script src="https://cdn.jsdelivr.net/gh/amine-amazou/css-directives@latest/dist/css-directives.js"></script>
<script>
    CssDirectives.init();
</script>
```

---

## **Getting Started**
1. **Register Custom Directives**:  
   Define reusable styles using the `CssDirectives.register` method:  

   ```javascript
   CssDirectives.register({
       highlight: { backgroundColor: 'yellow', color: 'black' },
       shadow: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }
   });
   ```

2. **Use Directives in HTML**:  
   Add attributes prefixed with `css:` to your HTML elements:  

   ```html
   <div css:highlight>
       This div is highlighted.
   </div>

   <div css:attach="highlight shadow">
       This div has both highlight and shadow styles.
   </div>
   ```

3. **Direct Inline Styles**:  
   Apply inline styles using standard CSS properties:  

   ```html
   <p css:font-size="20px" css:color="blue">
       This paragraph has custom inline styles.
   </p>
   ```

---

## **Usage Examples**

### **Basic Usage**

Register custom directives

```javascript
CssDirectives.register({
    rounded: { borderRadius: '10px' },
    border: { border: '1px solid black' },
    padding: { padding: '10px' }
});

```

Apply the directives in HTML

```html
<div css:rounded css:border css:padding>
    This div has rounded corners, a border, and padding.
</div>
```

### **Combining Styles**

Register custom directives

```javascript
CssDirectives.register({
    button: { backgroundColor: 'blue', color: 'white', padding: '10px 20px' },
    hover: { transition: '0.3s ease-in-out', transform: 'scale(1.1)' }
});
```

Apply the directives in HTML

```html
<button css:attach="button hover">Hover Me</button>
```

### **Merging Directives**

Register custom directives

```javascript
CssDirectives.register({
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px' },
    shadow: { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
});
```

Merge them

```javascript
CssDirectives.merge(['card', 'shadow'], 'cardWithShadow');
```

Apply the new directive in HTML

```html
<div css:cardWithShadow>
    This is a card with a shadow.
</div>
```

### **Direct Inline Properties**
No need to register a directive if you want quick styles:  

```html
<h1 css:font-size="30px" css:color="green">
    Large Green Heading
</h1>
```

### **Dynamic Directives**
Use JavaScript to dynamically register styles:  

```javascript
if (new Date().getHours() < 12) {
    CssDirectives.register({
        morning: { backgroundColor: 'lightblue' }
    });
} else {
    CssDirectives.register({
        evening: { backgroundColor: 'lightcoral' }
    });
}
```

```html
<div css:attach="morning">
    Good Morning or Evening!
</div>
```

---

## **Credits**

- Designed and Developed by [Amine Amazou](https://github.com/amine-amazou).
- Minified using [Toptal JavaScript Minifier](https://www.toptal.com/developers/javascript-minifier).
- Documentation and exemples by [ChatGPT](chatgpt.com).
