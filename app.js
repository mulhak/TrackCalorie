//......... STORAGE CONTROLLER........................................


//......... ITEM CONTROLLER...........................................

  const ItemCtrl  = (function() {
   
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
       }

       //Data Structure / State
       const data =  {

           items: [ ] , currentItem: null , totalCalories: 0
       }

      // return public methods (ItemCrtl)
       return{

           getItems: function() {
               return data.items;
           },
           
           addItem: function(name, calories) {
               let ID;
               //Create ID here as its needed for newItems
               if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id +1;

               }else {
                       ID = 0;
               }
             
               calories = parseInt(calories);
                
               //Create new item
               newItem = new Item(ID, name, calories);
               
               //Add to items array
               data.items.push(newItem);

               return newItem;

           },

           getItemById: function(id) {

               let foundItem = null;
               //loop though items
               data.items.forEach(function(item) {
                   if(item.id === id) {
                       foundItem = item;
                   }
               });
               return foundItem;
              
           },
           updateItem: function(name, calories) {
               //calories to number 
               calories = parseInt(calories);

               let found = null;
               
               data.items.forEach(function(item){
                   if (item.id === data.currentItem.id){
                       item.name = name ;
                       item.calories = calories;
                       found = item;
                   }
               });
               return found;

           },

           setCurrentItem: function(item) {

               data.currentItem = item;

           },
              
           getCurrentItem: function() {

               return data.currentItem;

           },

           getTotalCalories: function() {
                 
            let total = 0;
            data.items.forEach( function(item) {

             total += item.calories;
            });

           //|Get total cals in data structure
           data.totalCalories = total;
           return data.totalCalories;

           },

           logData: function() {
               return data;
           }
       }
 
})();



 //....... UI CONTROLLER ..............................................

  const UICtrl = (function() {

    const UISelectors  = {
       itemList: '#item-list',
       listItems:'#item-list li',
       addBtn: '.add-btn',
       updateBtn:'.update-btn',
       deleteBtn:'.delete-btn',
       backBtn:'.back-btn',

       itemNameInput: '#item-name',
       itemCaloriesInput:'#item-calories',
       totalCalories:'.total-calories'


    }
         
    //return public methods
    return {
        populateItemList: function(items) {
            
            let html = '';

            items.forEach(function(item) {
             
                 html +=` <li class="collection-item" id="item-${item.id}"> <strong>${item.name}:</strong> 
                 <em>${item.calories} Calories</em> 
                 <a href="#"  class="secondary-content">
                      <i class=" edit-item fa fa-pencil"></i></a>
             </li> `;
            });
            
         //Insert list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
        },
         
        getItemInput: function() {

            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item) {
            //show list item
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = "collection-item";
        
            //Add ID
            li.id = `item-${item.id}`;
            //Create html
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
            <a href="#"  class="secondary-content">
                 <i class=" edit-item fa fa-pencil"></i></a>`;
        
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)


        },
        //Update the listItems in UI 
         updateListItem: function(item) {
           
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            //Turn Node list into array 
            listItems = Array.from(listItems);

        listItems.forEach(function(listItems) {

            const itemID = listItems.getAttribute('id');

            if(itemID === `item-${item.id}`){

                document.querySelector(`#${itemID}`).innerHTML = 
                `<strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
                <a href="#"  class="secondary-content">
                     <i class=" edit-item fa fa-pencil"></i></a>`;
                    
           
 
            }
           });
            // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            UICtrl.clearEditState();
         },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        hideList:function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';


        },
        showTotalCalories: function(totalCalories) {

            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;


        },

        //edit + update state..

        clearEditState : function() {
     
          UICtrl.clearInput();
          document.querySelector(UISelectors.updateBtn).style.display= 'none';
          document.querySelector(UISelectors.deleteBtn).style.display = 'none';
          document.querySelector(UISelectors.backBtn).style.display = 'none';
          document.querySelector(UISelectors.addBtn).style.display = 'inline'

        },

        showEditState : function() {
     
            document.querySelector(UISelectors.updateBtn).style.display= 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none'
  
          },
      
        getSelectors: function() {
            
            return UISelectors;

        }
    }

})();



// ..........APP CONTROLLER...................................................

  const AppMainCtrl = (function(ItemCtrl, UICtrl) {
      

       //Load event listners
      const loadEventListners = function() {

      //Get UI selectors
      const UISelectors  = UICtrl.getSelectors();

      //Add item event
       document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

       //prevent "Enter"button from executing

       document.addEventListener('beforeInput', function(e) {
           if(e.keyCode===13 ) {
               e.preventDefault();
               return false;
           }
       });

       // Edit + update state...  Edit icon click event..
       document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

       //Edit + update state ...Update item event..
       document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdatedSubmit);

    }
    const itemAddSubmit = function(e) {

        //Get input from UI Controller
        const input = UICtrl.getItemInput();
        
        //Check that  'name  and calorie' inputs have values..
        if(input.name !== '' && input.calories !== '') {

            //Add item
           const newItem =  ItemCtrl.addItem(input.name, input.calories);

           //Add item to UI list
           UICtrl.addListItem(newItem);
       
           // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

          //Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

           //Clear fields
           UICtrl.clearInput();

        }
    
            e.preventDefault();
    }
         // Edit + update state

        const itemEditClick = function(e) {
          if(e.target.classList.contains('edit-item')) {
              
            const listId = e.target.parentNode.parentNode.id;
        
            //Break into an array
            const listIdArr = listId.split('-');
            
            //get the actual id from array
             const id = parseInt(listIdArr[1]);
             
             // get item by id
             const itemToEdit = ItemCtrl.getItemById(id);

             //Set current item
             ItemCtrl.setCurrentItem(itemToEdit);

             //Add item to form

             UICtrl.addItemToForm();
             e.preventDefault() ;  
            }

          }

          const itemUpdatedSubmit = function(e) {

            //Get item input
            const input = UICtrl.getItemInput();
            
            //Update item
            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

             //Update UI
             UICtrl.updateListItem(updatedItem);

           e.preventDefault();
          }

  


    //return public methods..(AppMainCtrl)
    return {
        init: function() {

            //edit + update state..
             UICtrl.clearEditState();

             //Fetch items from data structure
            const items = ItemCtrl.getItems();
           
            if(items.length === 0) {
                UICtrl.hideList();

            }else {
                 //Populate list with items
            UICtrl.populateItemList(items);
            }
           // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories();

           //Add total calories to UI
             UICtrl.showTotalCalories(totalCalories);

            //load event listners
            loadEventListners();
        }
    }
   

})(ItemCtrl, UICtrl);


//..........................................................................


//call public method...(AppMainCtrl)

  AppMainCtrl.init();
