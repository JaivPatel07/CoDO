from accounts.models import User
from profiles.models import UserProfile

users=User.objects.order_by('id')[:100]

FIRST_NAMES = [
    "Rahul", "Priya", "Amit", "Neha", "Arjun", "Isha", "Rohan", "Ananya",
    "Vivek", "Kavya", "Aditya", "Sneha", "Yash", "Pooja", "Karan", "Nisha",
    "Harsh", "Aarav", "Diya", "Manav", "Riya", "Krishna", "Dev", "Nidhi",
    "Sahil", "Meera", "Aryan", "Tanvi", "Parth", "Aisha", "Dhruv", "Palak",
    "Tushar", "Muskan", "Ritik", "Sanya", "Om", "Kiara", "Varun", "Riddhi",

    "Ethan", "Olivia", "Liam", "Emma", "Noah", "Sophia", "Lucas", "Mia",
    "James", "Charlotte", "Benjamin", "Amelia", "Henry", "Ella", "Jack",
    "Grace", "Daniel", "Chloe", "Michael", "Lily", "David", "Emily",
    "Matthew", "Zoe", "Alexander", "Hannah", "William", "Scarlett",
    "Joseph", "Victoria", "Aiden", "Layla", "Samuel", "Aria", "Logan",
    "Nora", "Sebastian", "Hazel", "Owen", "Aurora", "Levi", "Penelope",
    "Isaac", "Lucy", "Gabriel", "Stella", "Julian", "Violet", "Leo",
    "Natalie", "Ryan", "Claire", "Nathan", "Ruby", "Caleb", "Eva",
    "Thomas", "Alice", "Dylan", "Bella"
]
LAST_NAMES = [
    "Patel", "Shah", "Mehta", "Desai", "Joshi", "Trivedi", "Modi", "Bhatt",
    "Pandya", "Kapadia", "Raval", "Panchal", "Parmar", "Solanki", "Chauhan",
    "Patel", "Patel", "Sharma", "Verma", "Gupta", "Agarwal", "Singh", "Yadav",
    "Kumar", "Mishra", "Saxena", "Tiwari", "Pandey", "Jain", "Bansal",
    "Reddy", "Nair", "Menon", "Iyer", "Pillai", "Rao", "Shetty", "Naidu",
    "Gowda", "Kulkarni",

    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
    "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill",
    "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans",
    "Turner", "Parker", "Collins", "Edwards", "Stewart", "Morris",
    "Murphy", "Cook", "Rogers", "Morgan", "Bell", "Bailey", "Cooper"
]


for i,user in enumerate(users):
    role = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'Mobile Developer', 'AI / ML Engineer'][i % 6]
    country,state,city = [('India', 'Gujarat', 'Ahmedabad'), ('India', 'Maharashtra', 'Pune'), ('India', 'Karnataka', 'Bengaluru'), ('USA', 'California', 'San Francisco'), ('Canada', 'Ontario', 'Toronto')][i % 5]
    experience_level = ["Student", "Beginner", "Intermediate", "Professional"] [i % 4]
    name = FIRST_NAMES[i]
    college = ['LJ University', 'IIT Bombay', 'NIT Trichy', 'DAIICT', 'MIT', 'Stanford University', 'University of Toronto'][i % 7]

    BIO_TEMPLATES = [
     f"I'm {name}, currently pursuing my studies at {college}. I'm passionate about becoming a {role} and enjoy exploring new technologies and frameworks.",

     f"Hi, I'm {name}. I'm studying at {college} and working towards becoming a skilled {role}. I enjoy building projects and collaborating with like-minded developers.",

     f"My name is {name}, and I'm pursuing my degree at {college}. As an aspiring {role}, I love learning modern technologies and solving real-world problems.",

     f"Hello! I'm {name}, currently studying at {college}. My goal is to become a successful {role} by continuously learning and building practical applications.",

     f"I'm {name}. Currently studying at {college}, I'm passionate about becoming a {role} and enjoy exploring new frameworks and development tools.",

     f"Hi! My name is {name}. I'm a student at {college} with a strong interest in becoming a {role}. I enjoy teamwork, innovation, and software development.",

     f"I'm {name}, a student at {college}. I'm working hard to become a professional {role} while improving my technical and problem-solving skills.",

     f"My name is {name}. I study at {college} and aspire to build a successful career as a {role}. I'm always eager to learn and take on new challenges.",

     f"Hello, I'm {name}. Currently pursuing my education at {college}, I enjoy creating innovative solutions and growing as a {role}.",

     f"I'm {name}, currently enrolled at {college}. My ambition is to become a talented {role} and contribute to impactful software projects.",

     f"Hi, I'm {name}. At {college}, I'm developing my skills to become a confident {role}. I enjoy coding, teamwork, and continuous learning.",

     f"My name is {name}, and I'm studying at {college}. I aspire to become an experienced {role} by working on real-world applications and hackathons.",

     f"I'm {name}, pursuing my degree at {college}. As a future {role}, I'm passionate about building useful applications and learning modern technologies.",

     f"Hello! I'm {name}. I'm currently studying at {college} and preparing for a career as a {role}. I enjoy exploring innovative software solutions.",

     f"I'm {name}. Studying at {college} has strengthened my interest in becoming a {role}. I enjoy collaborating on exciting technical projects.",

     f"My name is {name}. I'm a student at {college} with the goal of becoming a skilled {role}. I'm passionate about technology and continuous improvement.",

     f"Hi, I'm {name}, currently pursuing my education at {college}. My focus is on becoming a successful {role} while gaining practical development experience.",

    f"I'm {name}. I study at {college} and aspire to become a creative {role}. I enjoy learning, experimenting, and building meaningful software.",

    f"Hello! My name is {name}. As a student at {college}, I'm dedicated to becoming a professional {role} and solving real-world challenges through technology.",

     f"I'm {name}, currently studying at {college}. I enjoy improving my technical skills and working towards a successful career as a {role}.",

     f"Hi! I'm {name}. I'm pursuing my studies at {college} with the ambition of becoming a knowledgeable {role}. I enjoy working on innovative projects.",

     f"My name is {name}. At {college}, I'm building the knowledge and experience needed to become a successful {role}.",

     f"I'm {name}, a student at {college}. My passion for technology motivates me to grow as a {role} and contribute to impactful software solutions.",

     f"Hello! I'm {name}. Currently studying at {college}, I enjoy building projects, participating in hackathons, and preparing for a career as a {role}.",

     f"I'm {name}. My journey at {college} has inspired me to pursue a career as a {role}. I enjoy learning modern technologies and collaborating with teams.",

     f"My name is {name}, and I'm currently studying at {college}. I'm passionate about becoming a {role} and continuously improving my development skills.",

     f"Hi, I'm {name}. As a student at {college}, I enjoy exploring software development and working towards becoming an accomplished {role}.",

     f"I'm {name}, pursuing my education at {college}. I aspire to become a {role} and enjoy transforming ideas into practical software solutions.",

     f"Hello! I'm {name}. I study at {college} and enjoy expanding my knowledge while preparing for a rewarding career as a {role}.",

     f"I'm {name}. Currently pursuing my degree at {college}, I'm dedicated to becoming a skilled {role} through continuous learning, collaboration, and hands-on development."
][i%30]
    profile,_=UserProfile.objects.get_or_create(
        user=user,
        defaults={
            'profile_pic':'https://i.pravatar.cc/300?img=%d'%(i+1),
            'firstname':name,
            'lastname':LAST_NAMES[i],
            'phone':str(9000000000+i),
            'country':country,
            'state':state,
            'city':city,
            'college':college,
            'degree':'B.Tech Computer Science',
            'school':'ABC Higher Secondary School',
            'graduation_year':2028+(i%3),
            'bio':BIO_TEMPLATES,
            'experience':experience_level,
            'preferred_role':role,
            'selectedSkills':{'Frontend Developer': ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'Git'], 'Backend Developer': ['Python', 'Django', 'Flask', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'], 'Full Stack Developer': ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git', 'TypeScript'], 'UI/UX Designer': ['React', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'Git'], 'Mobile Developer': ['Java', 'Firebase', 'C#', 'Git', 'Docker'], 'AI / ML Engineer': ['Python', 'C++', 'Docker', 'AWS', 'Git', 'PostgreSQL']}[role],
            'git_link':f'https://github.com/{user.username}',
            'portfolio_link':f'https://{user.username}.dev',
            'linkedin_link':f'https://linkedin.com/in/{user.username}',
            'embedding':None,
        }
    )
print('Profiles created.')