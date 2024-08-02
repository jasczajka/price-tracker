
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
        // Add custom styling for choosing elements
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = './utils/selector_choosing/styles.css'
        window.document.head.prepend(link)

        const buttonContainer = document.createElement('div')
        buttonContainer.setAttribute('class', 'selector-button-container')

        // Create the buttons
        const indicateRegularPriceButton = document.createElement('button')
        indicateRegularPriceButton.textContent = 'Indicate Regular Price'
        indicateRegularPriceButton.setAttribute('class', 'selector-button')
        indicateRegularPriceButton.addEventListener('click', enableRegularSelector)
        
        const indicateDiscountedPriceButton = document.createElement('button')
        indicateDiscountedPriceButton.textContent = 'Indicate Discounted Price'
        indicateDiscountedPriceButton.setAttribute('class', 'selector-button')
        indicateDiscountedPriceButton.addEventListener('click', enableDiscountedSelector)

        const confirmSelectionButton = document.createElement('button')
        confirmSelectionButton.textContent = 'Confirm Selection'
        confirmSelectionButton.setAttribute('class', 'selector-button')
        confirmSelectionButton.addEventListener('click', submitSelectors)

        // Add the buttons to the container
        buttonContainer.appendChild(indicateRegularPriceButton)
        buttonContainer.appendChild(indicateDiscountedPriceButton)
        buttonContainer.appendChild(confirmSelectionButton)
        // Add the container to the body
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
              e.target.classList.add('regular_price')
              isRegularSelectorChosen = true
            }
            if(isDiscountedCaptureSelectorEnabled) {
              console.log("discounted price chosen")
              e.target.classList.remove('hovered')
              discountedSelector = getCSSSelector(e.target)
              e.target.classList.add('discounted_price')
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
            .filter(c => c !== 'regular_price' && c !== 'discounted_price')
            .map((c) => `.${c}`).join('');
            if (attr.name === 'name') selector += `[${attr.name}=${attr.value}]`
        }
        return selector
      }
    }
)}



export default getSelectorsFromUser