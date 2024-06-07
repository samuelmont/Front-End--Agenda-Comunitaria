export const main = async () => {
  const signinButton = document.getElementById('signin-button');
  if(signinButton) signinButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const dataPost = getDataCreate();

    if(typeof(dataPost) == "string") return alert(dataPost);

    const response = await createUserFetch(dataPost);

    if(response.errors) return response.errors.forEach((e) => alert(e));

    if(response.success) {
      alert("Cadastro efetuado com successo.");
      document.location.href = '/Front-end/login-signin.html';
    }
  })

  const loginButton = document.getElementById('login-button');
  if(loginButton) loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const dataPost = getDataLogin();

    const response = await loginUserFetch(dataPost);

    if(response.errors) return response.errors.forEach((e) => alert(e));

    if(response.success) {
      localStorage.setItem("token", response.success);
      document.location.href = '/Front-end/pages/home.html';
    }
  })

}

const getDataCreate = () => {
  const name = document.getElementById('signin-name').value;
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const repassword = document.getElementById('signin-repassword').value;
  const contactNumber = document.getElementById('signin-contact').value;

  let dataPost = {
    "name": name,
    "email": email,
    "password": password,
    "contact_number": contactNumber,
  }

  if (password != repassword) return "As senhas são diferentes";

  return dataPost;
}


const getDataLogin = () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  let dataPost = {
    "email": email,
    "password": password,
  }

  return dataPost;
}

const createUserFetch = async (dataPost) => {
  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPost)
  };

  const response = await fetch('http://localhost:5001/login/register', options);
  const data = await response.json();
  return data;
}

const loginUserFetch = async (dataPost) => {
  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPost)
  };

  const response = await fetch('http://localhost:5001/login/login', options);
  const data = await response.json();
  return data;
}

main();
