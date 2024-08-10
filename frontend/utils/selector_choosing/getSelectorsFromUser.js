
const getSelectorsFromUser = (window) => {
    return new Promise((resolve, reject) => {
      let regularSelector = null
      let discountedSelector = null
      let isRegularCaptureSelectorEnabled = false
      let isDiscountedCaptureSelectorEnabled = false
      let isRegularSelectorChosen = false
      let isDiscountedSelectorChosen = false

      if (window.document.readyState === 'loading'){
        window.document.addEventListener('DOMContentLoaded', initialize)
      }
      else{
        initialize()
      }

      function initialize(){
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = './utils/selector_choosing/styles.css'
        window.document.head.prepend(link)

        const buttonContainer = document.createElement('div')
        buttonContainer.setAttribute('class', 'selector-button-container')

        //create buttons
        const buttonsConfig = [
          { text: 'Indicate Regular Price', handler: enableRegularSelector },
          { text: 'Indicate Discounted Price', handler: enableDiscountedSelector },
          { text: 'Confirm Selection', handler: submitSelectors }
        ];
        buttonsConfig.forEach(config => {
          const button = document.createElement('button');
          button.textContent = config.text;
          button.className = 'selector-button'; // Ensure this class has the proper styles applied
          button.addEventListener('click', config.handler);
          buttonContainer.appendChild(button);
        });
        window.document.body.prepend(buttonContainer)
      }

      function enableRegularSelector(){
        if(!isDiscountedCaptureSelectorEnabled && !isRegularSelectorChosen){
          console.log("regular selector enabled")
          window.document.addEventListener('click', selectionClickListener)
          window.document.addEventListener('mouseover', addHoverEffect)
          window.document.addEventListener('mouseout', removeHoverEffect)
          isRegularCaptureSelectorEnabled = true
        }
      }

      function enableDiscountedSelector(){
        if(!isRegularCaptureSelectorEnabled && !isDiscountedSelectorChosen){
          console.log("discounted selector enabled")
          window.document.addEventListener('click',selectionClickListener)
          window.document.addEventListener('mouseover', addHoverEffect)
          window.document.addEventListener('mouseout', removeHoverEffect)
          isDiscountedCaptureSelectorEnabled = true;
        }
      }

      function submitSelectors(){
        if(!regularSelector){
          alert('no regular selector chosen')
          return
        }
        if(!discountedSelector){
          resolve([regularSelector, null])
        }
        else{
          resolve([regularSelector, discountedSelector])
        }
      }

      function selectionClickListener(e) {
        console.log(e.target.classList)
        if(!e.target.classList.contains('selector-button-container') && !e.target.classList.contains('selector-button')){
          if (isDiscountedCaptureSelectorEnabled || isRegularCaptureSelectorEnabled){
            
            if(isRegularCaptureSelectorEnabled){
              console.log("regular price chosen")
              
              e.target.classList.remove('hovered')
              regularSelector = getCSSSelector(e.target)
              e.target.classList.add('regular-price')
              isRegularSelectorChosen = true
            }
            if(isDiscountedCaptureSelectorEnabled) {
              console.log("discounted price chosen")
              e.target.classList.remove('hovered')
              discountedSelector = getCSSSelector(e.target)
              e.target.classList.add('discounted-price')
              isDiscountedSelectorChosen = true
            }
            isRegularCaptureSelectorEnabled = false
            isDiscountedCaptureSelectorEnabled = false
            console.log("selector disabled")
            window.document.removeEventListener('mouseover', addHoverEffect)
            window.document.removeEventListener('mouseout', removeHoverEffect)
            window.document.removeEventListener('click',selectionClickListener)
          }
        }
      }
      
      
      function addHoverEffect  (event) {
        event.target.classList.add('hovered')
      }
      
      
      function removeHoverEffect (event ){
        event.target.classList.remove('hovered')
      }
      
      
      function getCSSSelector(el){
        let selector = el.tagName.toLowerCase();
        const attrs = el.attributes
        for (var i = 0; i < attrs.length; i++) {
            let attr = attrs.item(i)
            if (attr.name === 'id') selector += `#${attr.value}`
            if (attr.name === 'class') selector += attr.value.split(' ')
            .filter(c => c !== 'regular-price' && c !== 'discounted-price')
            .map((c) => `.${c}`).join('');
            if (attr.name === 'name') selector += `[${attr.name}=${attr.value}]`
        }
        return selector
      }
    }
)}



export default getSelectorsFromUser