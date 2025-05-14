import tippy, { Instance, Props } from "tippy.js";

export const syncTippyInstances = (tippyInstances: Instance<Props>[]) => {
    // Get all current tooltip elements
    const tooltipElements = Array.from(document.querySelectorAll('[data-tooltip]'));
    
    // Add new instances for elements without tippy
    tooltipElements.forEach(element => {
        const hasInstance = tippyInstances.some(instance => instance.reference === element);
        if (!hasInstance) {
          const tooltipContent = element.getAttribute('data-tooltip') || '';
          tippyInstances.push(tippy(element, {
              theme: "tippy-custom",
              arrow: false,
              content: tooltipContent,
              offset: [0, 5],
              placement: 'top',
              delay: [50, 0],
              duration: [50, 50],
              interactive: false,
              trigger: 'mouseenter focus'
          }));
      }
    });
  
    // Remove instances for elements no longer in DOM
    tippyInstances.forEach((instance, index) => {
        if (!tooltipElements.includes(instance.reference)) {
            instance.destroy();
            tippyInstances.splice(index, 1);
        }
    });
  }