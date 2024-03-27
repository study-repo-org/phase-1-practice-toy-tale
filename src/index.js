let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector('.add-toy-form');

  // Step 1: Fetch Andy's toys and render them on the page
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  function renderToy(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(toyCard);
  }

  fetchToys();



  // Step 2: Set up event listener for the form submission to add a new toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const name = formData.get('name');
    const image = formData.get('image');
    const likes = 0;

    const newToy = { name, image, likes };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);
      toyForm.reset();
    })
    .catch(error => console.error('Error adding new toy:', error));
  });



  

  // Step 3: Set up event listeners for each toy's "Like" button to update the like count
  toyCollection.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.dataset.id;
      
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          likes: parseInt(event.target.previousElementSibling.textContent) + 1
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        event.target.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
    }
  });
});
