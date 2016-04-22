(function()
{
   'use strict';
   /* eslint-disable */

   // Add jQuery sliding animation for accordion menu.
   var accordionMenu = $('.nav-accordion-menu');
   if( accordionMenu.length > 0 )
   {
      accordionMenu.each(function()
      {
         var accordion = $(this);

         // Detect change in the input[type="checkbox"] value
         accordion.on('change', 'input[type="checkbox"]', function()
         {
            var checkbox = $(this);
            ( checkbox.prop('checked') ) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(200) :
             checkbox.siblings('ul').attr('style', 'display:block;').slideUp(200);
         });
      });
   }

   /**
    * Hides the nav context menu if visible. If an event is supplied it is checked against any existing context menu
    * and is ignored if the context menu is within the parent hierarchy.
    *
    * @param {object|undefined}  event - Optional event
    */
   function hideNavContextMenu(event)
   {
      var contextMenuButton = $('#context-menu');
      var popupmenu = $('#contextpopup .mdl-menu__container');

      // If an event is defined then make sure it isn't targeting the context menu.
      if (event)
      {
         // Picked element is not the menu
         if (!$(event.target).parents('#contextpopup').length > 0)
         {
            // Hide menu if currently visible
            if (popupmenu.hasClass('is-visible')) { contextMenuButton.click(); }
         }
      }
      else // No event defined so always close context menu and remove node highlighting.
      {
         // Hide menu if currently visible
         if (popupmenu.hasClass('is-visible')) { contextMenuButton.click(); }
      }
   }

   /**
    * Shows the nav context menu
    *
    * @param {object}   event - jQuery mouse event
    */
   function onNavContextClick(event)
   {
      // Hides any existing nav context menu.
      hideNavContextMenu(event);

      var target = $(this);

      var scmLink = target.data('scm-link');
      var scmType = target.data('scm-type') || '...';

      var popupmenu = $('#contextpopup .mdl-menu__container');

      // Populate data for the context menu.
      popupmenu.find('li').each(function( index )
      {
         switch (index)
         {
            case 0:
               $(this).text('Open on ' + scmType);
               $(this).data('scm-link', scmLink);
               break;
         }
      });

      // Wrapping in a 100ms timeout allows MDL to draw animation when showing a context menu after one has been hidden.
      setTimeout(function()
      {
         // For MDL a programmatic click of the hidden context menu.
         var contextMenuButton = $("#context-menu");
         contextMenuButton.click();

         // Necessary to defer reposition of the context menu.
         setTimeout(function()
         {
            popupmenu.parent().css({ position: 'relative' });
            popupmenu.css({ left: event.pageX, top: event.pageY - $('header').outerHeight(), position:'absolute' });
         }, 0);
      }, 100);
   }

   /**
    * Handles clicks on the nav context menu invoking any active actions.
    */
   function onNavContextMenuClick()
   {
      // When a context menu is selected remove node highlighting.
      hideNavContextMenu();

      switch ($(this).data('action'))
      {
         case 'openSCMLink':
            var link = $(this).data('scm-link');

            if (typeof link === 'string')
            {
               window.open(link, '_blank', 'location=yes,menubar=yes,scrollbars=yes,status=yes');
            }
            break;
      }
   }

   // Handle context menu clicked
   $('#contextpopup li[data-action]').on('click', onNavContextMenuClick);

   // Prevent default browser context menu from being triggered.
   $('.nav-accordion-menu').bind('contextmenu', function(event) { event.preventDefault(); });

   // Properly handle closing context menu when document mouse down clicked
   // This works when a context click occurs because the new context menu is shown with a small timeout.
   $(document).bind('mousedown', hideNavContextMenu);
   $(window).bind('resize', hideNavContextMenu);

   $('[data-scm-link]').bind('contextmenu', onNavContextClick);
})();