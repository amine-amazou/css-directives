/*!
    css-directives - 1.0.0
    Author: Amine Amazou
    Description: A lightweight JavaScript library that simplifies styling HTML elements using custom directives.
    Copyright © 2025 amazou
    Licensed under the MIT license.
    https://github.com/amine-amazou/css-directives/blob/main/LICENSE
*/

;let CssDirectives = (function(w, d) {
    "use strict"
    
    function splitDirective(directive) {
        let splited = directive.split('-')
        splited.push('');
        return splited
    }

    function success() {
        return true;
    }

    function getFirstCharacter(string) {
        return string[0];
    }

    function isDirectiveComposedOfTwoParts(secondPartOfDirective) {
        return secondPartOfDirective !== '';
    }

    function formatAttributeKey(directive) {
        let [firstPart, secondPart] = splitDirective(directive);
        if(isDirectiveComposedOfTwoParts(secondPart)) 
            return `${firstPart}${getFirstCharacter(secondPart).toUpperCase()}${secondPart.slice(1).toLowerCase()}`
        else 
            return firstPart
    }

    function afterDOMContentLoaded(fn) {
        w.addEventListener('DOMContentLoaded', fn);
        return success();
    }

    function selectAllTheElementsInTheBody() {
        if(d.body.querySelectorAll !== null) {
            return d.body.querySelectorAll('*');
        }
        return Array.from(d.body.children);
    }

    function getAllTheCssAttributesOfAnElement(element) {
        return [...element.attributes];
    }

    function isAttributeStartsWithCss(attribute) {
        return attribute.nodeName.startsWith('css:')
    }

    function selectElementsIncludesDirectives(eachDirectiveCallback) {
        selectAllTheElementsInTheBody().forEach(element => {
            getAllTheCssAttributesOfAnElement(element)
                .filter(attribute => isAttributeStartsWithCss(attribute))
                .forEach(directive => eachDirectiveCallback(directive, element))
        })
        return success();
    }

    function isAttachDirective(directiveNodeName) {
        return directiveNodeName.toLowerCase() == "css:attach";
    }

    function extractDirectiveLabel(directiveNodeName) {
        return directiveNodeName.replace('css:', '')
    }
    
    function removeDirective(directiveNodeName, element) {
        element.removeAttribute(directiveNodeName)
    }

    function getKeysFromObject(object) {
        return Object.keys(object);
    }

    function getEntriesFromObject(object) {
        if(Object.entries !== null) {
            return Object.entries(object);
        }
        return getKeysFromObject(object).forEach(key => [key, object[key]]);
    }

    function directiveIsInstanceOfObject(directive) {
        return (directive instanceof Object || typeof directive == 'object') && !(Array.isArray(directive));
    }

    function extractDiretivesFromAttach(nodeValue) {
        return nodeValue.toLowerCase().split(' ');
    }

    function directiveIsArray(directive) {
        if(Array.isArray !== null) {
            return Array.isArray(directive)
        }
        return directive instanceof Array;
    }

    function directiveToArray(directive) {
        return [directive];
    }

    function navigateOnDirectives(directivesArray, callback) {
        directivesArray.forEach(directive => callback(directive));
    }

    function lowerCaseDirectiveNames(directivesObject = {}) {
        let lowercased = {};
        if(typeof directivesObject == 'object') {
            getKeysFromObject(directivesObject).forEach(directiveName => {
                let directiveStyle = directivesObject[directiveName];
                lowercased[directiveName.toLowerCase()] = directiveStyle;
            })
        }
        return lowercased;
    }

    class CssDirectivesBase {
        static customDirectives = {};
        static register(nameOrDirectives, styles) {
            if(directiveIsInstanceOfObject(nameOrDirectives)) this.customDirectives = { ...this.customDirectives, ...lowerCaseDirectiveNames(nameOrDirectives) }; 
            else this.customDirectives[nameOrDirectives.toLowerCase()] = styles;
            return success();
        }
        static apply(directiveCallback, element) {
            let directive = directiveCallback();
            if(directiveIsInstanceOfObject(directive)) {
                element.style[directive.attributeKey] = directive.value;
            } else {
                let directivesArray = directiveIsArray(directive) ? directive : directiveToArray(directive);
                navigateOnDirectives(directivesArray, (directive) => {
                    getEntriesFromObject(this.customDirectives[directive] ?? []).forEach(attribute => {
                        element.style[attribute[0]] = attribute[1]
                    })
                })
            }
            return success();
            
        }
        static isCustomDirective(targetName) {
            return getKeysFromObject(this.customDirectives).includes(targetName);
        }

        static merge(directives = [], inDirective) {
            let styles = {};
            directives.forEach(directive => {
                Object.assign(styles, this.customDirectives[directive.toLowerCase()])
            })
            return this.register(inDirective, styles)
        }

        static init() {
            afterDOMContentLoaded(() => {
                selectElementsIncludesDirectives((directive, element) => {
                    this.apply(() => {
                        if(isAttachDirective(directive.nodeName)) return extractDiretivesFromAttach(directive.nodeValue);
                        let attributeKey = formatAttributeKey(extractDirectiveLabel(directive.nodeName))
                        if(this.isCustomDirective(attributeKey)) return attributeKey;
                        else return { attributeKey, value: directive.nodeValue };
                    }, element)
                    removeDirective(directive.nodeName, element);
                })
            })
        }
    }

    class CssDirectives {

        /**
         * This function registers one or multiple directives.
         *
         * @since 1.0.0
         * @static
         * @memberof CssDirectives
         * @param {string|object} nameOrDirectives - A directive's name or an object of directives
         * @throws {TypeError} - if nameOrDirectives is not a string or object
         * @param {object} styles - An object of styles to set to the directive
         * @throws {TypeError} - if styles is not an object
         * @example
         * <script>
            CssDirectives.register('center', { textAlign: 'center' });
         * </script>
         * <h1 css:center> Title in center </h1>
         * @returns {boolean} Returns true if the directives is registred with successfully.
        */

        static register(nameOrDirectives, styles = {}) {
            if(typeof nameOrDirectives !== 'string' && typeof nameOrDirectives !== 'object') {
                throw TypeError('Invalid argument type: "nameOrDirectives" parameter must be a string or an object.')
            }
            if(typeof styles !== 'object') {
                throw TypeError('Invalid argument type: "styles" parameter must be an object.')
            }
            return CssDirectivesBase.register(nameOrDirectives, styles)
        }

        /**
         * This function merges two directives or more in one new directive.
         *
         * @since 1.0.0
         * @static
         * @memberof CssDirectives
         * @param {Array} directives - An array of directives names
         * @param {string} inDirective - The new directive name
         * @throws {TypeError} - if inDirective is not a string
         * @throws {Error} - if inDirective is an empty string
         * @example
         * <script>
            CssDirectives.register('center', { textAlign: 'center' });
            CssDirectives.register('red', { color: 'red' }));
            CssDirectives.merge(['center', 'red', 'title'])
         * </script>
         * <h1 css:title> Red title in center </h1>
         * @returns {boolean} Returns true if the directives is merged with successfully.
        */

        static merge(directives = [], inDirective) {
            if(typeof inDirective !== 'string') {
                throw TypeError('Invalid argument type: "inDirective" parameter must be a string.')
            }
            if(inDirective.trim() === '') {
                throw Error('Invalid argument value: "inDirective" parameter must not be an empty string.')
            }
            return CssDirectivesBase.merge(directives, inDirective);
        }

        /**
         * This function initialize the library by applying the registred directives.
         *
         * @static
         * @memberof CssDirectives
         * @since 1.0.0
         * @returns {void}. 
        */

        static init() {
            return CssDirectivesBase.init()
        }
    }

    return CssDirectives;
})(window, document)
