const generateApprovalMessage = (instructor, course) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <header style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Course Approved!</h1>
    </header>
    
    <main style="padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Dear ${instructor.fullName},
      </p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        We are pleased to inform you that your course, <strong>"${
          course.title
        }"</strong>, has been approved and is now live on our platform.
      </p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        This is an exciting milestone, and we commend you for your hard work in creating valuable content for our learners.
      </p>
      
      <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; margin: 20px 0; padding: 15px;">
        <p style="font-size: 16px; line-height: 1.5; color: #333; margin: 0;">
          <strong>Course Details:</strong><br>
          Title: ${course.title}<br>
          ID: ${course._id}<br>
          Approval Date: ${new Date().toDateString()}
        </p>
      </div>
    
    </main>
    
    <footer style="background-color: #f1f1f1; color: #666; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 5px 5px;">
      <p style="margin: 0;">
        Thank you for being a valued instructor on our platform.<br>
        If you have any questions, please don't hesitate to contact our support team.
      </p>
    </footer>
  </div>
    `;
};

const generateWelcomeMessage = (user) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Digital Madrasah</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4a5568;">Welcome to Digital Madrasah - Your Journey in Islamic Learning Begins!</h1>
    
    <p>Dear ${user.fullName},</p>
    
    <p>Assalamu Alaikum (Peace be upon you),</p>
    
    <p>We are thrilled to welcome you to Digital Madrasah, your new home for enriching Islamic education. Thank you for taking the first step on this blessed journey of knowledge and spiritual growth.</p>
    
    <h2 style="color: #2d3748;">Registration Confirmation</h2>
    <p>Your account has been successfully created with the email address: ${user.email}</p>
    
    <h2 style="color: #2d3748;">Next Steps</h2>
    <ol>
        <li><strong>Complete Your Profile</strong>: Enhance your learning experience by updating your profile. This helps us tailor our recommendations to your interests and goals.</li>
        <li><strong>Explore Our Courses</strong>: Browse through our diverse catalog of Islamic courses. From Quranic studies to Islamic history, we offer a wide range of topics to cater to all levels of learners.</li>
        <li><strong>Stay Tuned</strong>: We're currently in our pre-launch phase. Keep an eye on your inbox for our official launch announcement, where we'll unveil our full suite of features and courses.</li>
    </ol>
    
    <h2 style="color: #2d3748;">What You Can Expect From Us</h2>
    <ul>
        <li>High-quality, authentic Islamic courses</li>
        <li>Expert instructors and scholars</li>
        <li>A supportive learning community</li>
        <li>Regular updates on new courses and features</li>
    </ul>
    
    <h2 style="color: #2d3748;">Need Help?</h2>
    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@digitalmadrasah.com.</p>
    
    <p>May Allah (SWT) bless your journey in seeking knowledge.</p>
    
    <div style="font-style: italic; border-left: 3px solid #4a5568; padding-left: 10px; margin: 20px 0;">
        Remember, the Prophet Muhammad (peace be upon him) said: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise." (Sahih Muslim)
    </div>
    
    <p>We look forward to being a part of your Islamic learning journey.</p>
    
    <p>Jazak Allah Khair (May Allah reward you with goodness),</p>
    
    <p>The Digital Madrasah Team</p>
    
    <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 0.9em; color: #718096;">
        <p>Digital Madrasah<br>
        https://digitalmadrasah.vercel.app<br>
        [Social Media Links]</p>
        
        <p>If you didn't create an account on our platform, please ignore this email or contact us immediately.</p>
    </div>
</body>
</html>
  `;
};

module.exports = { generateApprovalMessage, generateWelcomeMessage };