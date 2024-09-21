document.getElementById('emailForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Capture all form data fields
  const formData = {
    name: document.getElementById('senderName').value,        // Sender's Name
    phone: document.getElementById('phone').value,            // Phone Number
    email: document.getElementById('recipientEmail').value,   // Recipient's Email
    subject: document.getElementById('subject').value,        // Subject
    message: document.getElementById('message').value         // Message
  };

  try {
    const response = await fetch('http://localhost:8080/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // Send the form data as JSON
    });

    const data = await response.json();

    // Handle the response
    if (response.ok) {
      alert(data.message); // Success message
    } else {
      alert(`Error: ${data.message}`); // Error message
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while sending the email.');
  }
});
