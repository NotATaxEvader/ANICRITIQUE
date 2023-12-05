document.addEventListener('DOMContentLoaded', () => {
  async function validateLoginAdminForm(event) {
    event.preventDefault();

    var usernameInput = document.getElementById('username').value;
    var passwordInput = document.getElementById('password').value;
    var errorMessage = document.getElementById('error-message');

    try {
      // Send a POST request to the server to check login credentials
      const response = await fetch('/logadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the appropriate page based on the technician flag
        window.location.href = '/admin'
      } else {
        // Display the error message from the server
        errorMessage.textContent = data.message;
      }
    } catch (error) {
      // Handle any errors that may occur during login
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
  }

  const form = document.querySelector('form');
  form.addEventListener('submit', validateLoginAdminForm);
});
