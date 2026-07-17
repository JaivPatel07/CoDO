import requests 

user_git_data = requests.get(f"https://api.github.com/users/preyans-alt/repos")


print(user_git_data.json()[0])