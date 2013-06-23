$(document).ready(function() {

  		var ListItem, query, noTasksMessage = $('#no-incomplete-message'), 
			submitBtn = $("#list-item-submit"), 
			incompleteItemList = $('#incomplete-items'), 
			completeItemList = $('#complete-items'), 
			input = $("#list-input");

           // enter your AppID and JsKey
			Parse.initialize("EII3iM43ZmAyVTxh9kDyzto2oZJajk3x6oc2fcGy", "fEETfTas7SF7qn0S8fT8VXIFKM4lvTaRPf0tm9dV");
			
			/***** "register add button click" and "enter keypress" event *****/
			submitBtn.on('click myEnterEvent',function(e) {
			   var $taskText = input.val();
        /*** check if input field is empty or not if empty dont add task to parse ********/
		       if ($.trim($taskText).length === 0) {
					return;
				}
				//Save the current Todo
				var text = $('#list-input').prop('value');
				var ListItem = Parse.Object.extend("ListItem");
				var listItem = new ListItem();

				listItem.set("content", text);
				listItem.set("isComplete", false);

				//Once it is saved, show it in the list of todo's.
				listItem.save(null, {
					success : function(item) {
						noTasksMessage.addClass('hidden');
						var $container = $('#todo-items-template');
						$container.find('input').attr({
							content : item.get('content'),
							id : item.id,
							isComplete : item.get('isComplete')
						});
						 
						var content = '<li class="list-item"><input type="checkbox" id= ' + item.id + '>' + item.get('content') + '</li>';

						incompleteItemList.append(content);
						input.prop('value', '').focus();
					},
					error : function(gameScore, error) {
						alert("Error while saving tasks: " + error.code + " " + error.message);
					}
				});

			});
 
 		/******** custom enter key press event  and trigger add event *******/
			input.on('keypress', function(e){
				if ((e.which == 13) || (e.keyCode == 13)) {
					e.preventDefault();
					submitBtn.trigger('myEnterEvent');
				}
				else{
					return;
				}
			})

			//Get 10 most recent incomplete Todos.
			ListItem = Parse.Object.extend("ListItem");
			query = new Parse.Query(ListItem);
			query.equalTo('isComplete', false)
			query.limit = 10;
			query.descending('createdAt');
			query.find({
				success : function(results) {
					if (results.length > 0) {
						//	noTasksMessage.addClass('hidden');
					}
					//Append each of the incomplete tasks to the Incomplete List
					$.each(results, function(i, val) {

						var content = '<li class="list-item"><input type="checkbox" id= ' + val.id + '>' + val.get('content') + '</li>';

						incompleteItemList.append(content);
					});

					//When the checkbox is clicked for any of the items in the incomplete list, update it as complete.
					incompleteItemList.on('click ', 'li', function(e) {
						var $self = $(this);

						query = new Parse.Query(ListItem);
						query.get($self.find('input').prop('id'), {
							success : function(item) {
								item.set('isComplete', true);
								item.save();

								$self.remove();

								if (incompleteItemList.all('li').size() >= 1) {
									noTasksMessage.removeClass('hidden');
								}

							},
							error : function(object, error) {
								alert("Error when updating todo item: " + error.code + " " + error.message);
							}
						});
					});
				},
				error : function(error) {
					alert("Error when retrieving Todos: " + error.code + " " + error.message);
				}
			});

		});
