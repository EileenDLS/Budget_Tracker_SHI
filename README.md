# Budget_Tracker_SHI
In this application, it allows users to indicate and track their spending per month for their indicated budget. 
Save user's monthly budget and monthly expenditures in sessionStorage. 
When users reload the application, and if there are saved data in sessionStorage, this application will load data and allow user to see it.

Users are able to do the following actions:
- Add a new month and new budget
- Add, edit and delete expenditures. Save it back to localStorage

JSON data format example:
[
   'date': '4/2023',
   'budget': 1342.22
   'expenditures': [{
      'description': 'pack of pens',
      'cost': 12.33
    }]
  }
]
