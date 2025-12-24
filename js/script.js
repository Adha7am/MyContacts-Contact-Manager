
var nameInput = document.getElementById('name');
var phoneInput = document.getElementById('phone');
var emailInput = document.getElementById('email');
var addressInput = document.getElementById('address');
var groupInput = document.getElementById('group');
var isEmergencyInput = document.getElementById('isEmergency');
var isFavoriteInput = document.getElementById('isFavorite');
var notesInput = document.getElementById('notes');
var imageInput = document.getElementById('image');

var addContactBtn = document.getElementById('addContactBtn');
var updateContactBtn = document.getElementById('updateContactBtn');

var htmlContainer = document.getElementById('allContactsWrapper');
var imagePreview = document.getElementById('imagePreview');

var searchInput = document.getElementById('searchInput');

var totalContactsNum = document.getElementById('totalContactsNum');

var favoritesContactsContainer = document.getElementById('FavoritesContacts');
var emergencyContactsContainer = document.getElementById('EmergencyContacts');

var regex = {
    name: {
        value: /^.{3,30}$/,
        isValid: false
    },
    phone: {
        value: /^(?:\+20|0)(10|11|12|15)\d{8}$/,
        isValid: false
    },
    email: {
        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        isValid: false
    },
    image: {
        value: /^.{1,}\.(jpe?g)$/,
        isValid: true,
    },
    address: {
        value: /^.{5,30}$/,
        isValid: false,
    }
}

var contactToUpdate;
var favorites = [];
var emergencies = [];

// All Contacts arr (main array)
var allContacts = [];

if (localStorage.getItem('allContacts') !== null) {
    allContacts = JSON.parse(localStorage.getItem('allContacts'));

    renderContacts();
}

function addContact() {

    var reader = new FileReader();

    if (imageInput.files[0]) {

        reader.readAsDataURL(imageInput.files[0]);
        var contact;
        reader.onload = function () {

            contact = {
                id: Date.now(),
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                address: addressInput.value,
                image: reader.result,
                group: groupInput.value,
                isEmergency: isEmergencyInput.checked,
                isFavorite: isFavoriteInput.checked,
                notes: notesInput.value
            };
            allContacts.push(contact);
            updateTotalContactsNum();
            localStorage.setItem('allContacts', JSON.stringify(allContacts));
            clearForm();
            renderContacts(allContacts);

        };
    } else {
        contact = {
            id: Date.now(),
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            address: addressInput.value,
            image: "./images/deafault.jpg",
            group: groupInput.value,
            isEmergency: isEmergencyInput.checked,
            isFavorite: isFavoriteInput.checked,
            notes: notesInput.value
        };
        allContacts.push(contact);
        updateTotalContactsNum();
        localStorage.setItem('allContacts', JSON.stringify(allContacts));
        clearForm();
        renderContacts(allContacts);
    }
}

function deleteContact(id) {

    allContacts = allContacts.filter(function (contact) {
        return contact.id != id;
    })
    localStorage.setItem('allContacts', JSON.stringify(allContacts));
    renderContacts(allContacts);

}

function clearForm() {
    nameInput.value = null;
    phoneInput.value = null;
    emailInput.value = null;
    addressInput.value = null;
    groupInput.value = null;
    isEmergencyInput.checked = false;
    isFavoriteInput.checked = false;
    notesInput.value = null;
    imageInput.value = null;
    imagePreview.src = './images/deafault.jpg';

    if (updateContactBtn && updateContactBtn.classList.contains('d-block')) {
        updateContactBtn.classList.replace('d-block', 'd-none');
    }
    if (addContactBtn) {
        addContactBtn.classList.remove('d-none');
    }

    Array.from(document.getElementsByClassName('my-alert')).forEach(function (alert) {
        if (!alert.classList.contains('d-none')) alert.classList.add('d-none');
    });

    Array.from(document.getElementsByClassName('form-control')).forEach(function (form) {
        form.classList.remove('is-valid');
        form.classList.remove('is-invalid');
    });

    addContactBtn.disabled = true;
    updateContactBtn.disabled = true;
}

function renderContacts(arr = allContacts) {
    htmlContainer.innerHTML = '';
    if (arr.length === 0) {
        htmlContainer.innerHTML = `
        
       <div class="w-100 d-flex justify-content-center align-items-center mt-5">
                            <div class="d-flex flex-column justify-content-center align-items-center">

                                <i class="fa-solid fa-user-plus fs-4 text-secondary my-2"></i>
                                <span class="text-secondary my-base-fs fw-bold ">No contacts found</span>
                                
                                <span class="text-secondary my-sm-fs"> Click "+ Add contact " to get started</span>
                                
                            </div>
                        </div>
        
        `;
    }

    for (let i = 0; i < arr.length; i++) {

        htmlContainer.innerHTML += `
             <div class="col-sm-6">
                            <div class="rounded-4 p-3 my-shadow bg-white contact-card">

                                <div class="contact d-flex flex-column gap-2">

                                    <div class="contact-header d-flex justify-content-start align-items-center gap-2">

                                        <div class="contact__pfp rounded-3 object-fit-cover my-shadow overflow-hidden">
                                            <img src="${arr[i].image}" alt="${arr[i].name}'s profile picture" class=" object-fit-cover w-100 h-100">
                                        </div>
                                        
                                        <div class="d-flex flex-column ">
                                            <h3 class="fw-bold fs-6 m-0 lh-1"> ${arr[i].name}</h3>
                                            <span class="text-muted">${arr[i].phone}</span>
                                        </div>

                                        <div class="ms-auto p-2 bg-secondary-subtle rounded-3 phone-icon">
                                            <a href="tel:${arr[i].phone}" class="anchor"> <i class="fa-solid fa-phone-flip text-success"></i> </a>
                                        </div>

                                    </div>

                                    <div class="contact-body ">

                                        <div class="d-flex justify-content-start align-items-center gap-2">
                                            <i class="fa-solid fa-envelope"></i>
                                            <span>${arr[i].email}</span>
                                        </div>

                                        <div class="d-flex justify-content-start align-items-center gap-2">
                                            <i class="fa-solid fa-location-dot"></i>
                                            <span>${arr[i].address}</span>
                                        </div>

                                    </div>

                                    <div
                                        class="contact-footer position-relative bottom-0 end-0 d-flex justify-content-end align-items-center">
                                        <div class="d-flex gap-2">
                                            <button class="${arr[i].isFavorite ? 'btn btn-warning' : 'btn btn-outline-warning'} btn-sm rounded-circle" onclick="toggleFavorite(${arr[i].id})"><i class="fa-solid fa-star "></i></button>
                                            <button class="${arr[i].isEmergency ? 'btn btn-danger' : 'btn btn-outline-danger'} btn-sm rounded-circle" onclick="toggleEmergency(${arr[i].id})"><i class="fa-solid fa-heartbeat "></i></button>
                                            <button class="btn btn-outline-dark btn-sm rounded-circle" data-bs-toggle="modal" data-bs-target="#addContactModal" onclick="setFormForUpdate(${arr[i].id})" ><i class="fa-solid fa-pen-to-square "></i></button>
                                            <button class="btn btn-outline-secondary btn-sm rounded-circle" onclick="deleteContact(${arr[i].id})"><i class="fa-solid fa-trash "></i></button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
        `;
    }
    renderFavorites();
    renderEmergency();
    updateTotalContactsNum();
    updateTotalFavoritesNum();
    updateTotalEmergencyNum();
}

var searchedContacts;
function searchContacts() {
    searchedContacts = allContacts.filter(function (contact) {
        return contact.name.toLowerCase().includes(searchInput.value.toLowerCase()) || contact.phone.includes(searchInput.value) || contact.email.toLowerCase().includes(searchInput.value.toLowerCase());
    })
    renderContacts(searchedContacts);

}

imageInput.onchange = function () {
    var reader = new FileReader();
    if (imageInput.files[0]) {

        reader.readAsDataURL(imageInput.files[0]);
        reader.onload = function () {
            imagePreview.src = reader.result;
        }
    }
}

function setFormForUpdate(id) {
    addContactBtn.classList.add('d-none');
    updateContactBtn.classList.replace('d-none', 'd-block');

    contactToUpdate = allContacts.find(function (contact) {
        return contact.id == id;
    })

    nameInput.value = contactToUpdate.name;
    phoneInput.value = contactToUpdate.phone;
    emailInput.value = contactToUpdate.email;
    addressInput.value = contactToUpdate.address;
    groupInput.value = contactToUpdate.group;
    isEmergencyInput.checked = contactToUpdate.isEmergency;
    isFavoriteInput.checked = contactToUpdate.isFavorite;
    notesInput.value = contactToUpdate.notes;
    imagePreview.src = contactToUpdate.image;


    Array.from(document.getElementsByClassName('to-validate')).forEach(function (form) {
        regex[form.id].isValid = true;
    });
    toggleUpdateContactBtn();
}

function updateContact() {

    var reader = new FileReader();

    if (imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
        reader.onload = function () {
            contactToUpdate.image = reader.result;
            contactToUpdate.name = nameInput.value;
            contactToUpdate.phone = phoneInput.value;
            contactToUpdate.email = emailInput.value;
            contactToUpdate.address = addressInput.value;
            contactToUpdate.group = groupInput.value;
            contactToUpdate.isEmergency = isEmergencyInput.checked;
            contactToUpdate.isFavorite = isFavoriteInput.checked;
            contactToUpdate.notes = notesInput.value;
            clearForm();
            renderContacts(allContacts);
            localStorage.setItem('allContacts', JSON.stringify(allContacts));
        }
    } else {
        contactToUpdate.name = nameInput.value;
        contactToUpdate.phone = phoneInput.value;
        contactToUpdate.email = emailInput.value;
        contactToUpdate.address = addressInput.value;
        contactToUpdate.group = groupInput.value;
        contactToUpdate.isEmergency = isEmergencyInput.checked;
        contactToUpdate.isFavorite = isFavoriteInput.checked;
        contactToUpdate.notes = notesInput.value;
        clearForm();
        renderContacts(allContacts);
        localStorage.setItem('allContacts', JSON.stringify(allContacts));
    }


    addContactBtn.classList.remove('d-none');
    updateContactBtn.classList.replace('d-block', 'd-none');
}

function updateTotalContactsNum() {
    totalContactsNum.textContent = allContacts.length;
}

function updateTotalFavoritesNum() {
    totalFavoritesNum.textContent = favorites.length;
}

function updateTotalEmergencyNum() {
    totalEmergencyNum.textContent = emergencies.length;
}

function toggleFavorite(id) {
    var contact = allContacts.find(function (c) {
        return c.id == id;
    });
    if (contact) {
        contact.isFavorite = !contact.isFavorite;
        localStorage.setItem('allContacts', JSON.stringify(allContacts));
        renderContacts();
    }
}

function toggleEmergency(id) {
    var contact = allContacts.find(function (c) {
        return c.id == id;
    });
    if (contact) {
        contact.isEmergency = !contact.isEmergency;
        localStorage.setItem('allContacts', JSON.stringify(allContacts));
        renderContacts();
    }
}

function renderFavorites() {
    favoritesContactsContainer.innerHTML = '';
    favorites = allContacts.filter(function (contact) {
        return contact.isFavorite;
    });

    if (favorites.length === 0) {
        favoritesContactsContainer.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center py-3 text-center">
                 <i class="fa-solid fa-star text-muted mb-1"></i>
                 <span class="text-secondary my-sm-fs">No favorites yet</span>
            </div>
        `;
    }

    favorites.forEach(function (contact) {
        favoritesContactsContainer.innerHTML += `
        <div class="col-xl-12 col-6 ">
            <div class="d-flex p-2 align-items-center rounded-3 side-contact my-shadow ">

                <div class="rounded-3 pfp-sm my-shadow overflow-hidden ">
                    <img src="${contact.image}" alt="${contact.name}'s profile picture" class=" object-fit-cover w-100 h-100 ">
                </div>

                <div class="d-flex flex-column justify-content-center ms-2">
                    <span class="fw-bold my-base-fs">${contact.name}</span>
                    <span class="text-muted my-sm-fs">${contact.phone}</span>
                </div>

                 <div class="ms-auto p-2 bg-secondary-subtle rounded-3 phone-icon">
                    <a href="tel:${contact.phone}" class="anchor"> <i class="fa-solid fa-phone-flip text-success"></i> </a>
                </div>
            </div>
        </div>
        `;
    });
    updateTotalFavoritesNum();
}

function renderEmergency() {
    emergencyContactsContainer.innerHTML = '';
    emergencies = allContacts.filter(function (contact) {
        return contact.isEmergency;
    });

    if (emergencies.length === 0) {
        emergencyContactsContainer.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center py-3 text-center">
                 <i class="fa-solid fa-heart-pulse text-muted mb-1"></i>
                 <span class="text-secondary my-sm-fs">No emergency contacts</span>
            </div>
        `;
    }

    emergencies.forEach(function (contact) {
        emergencyContactsContainer.innerHTML += `
        <div class="col-xl-12 col-6 ">
            <div class="d-flex p-2 align-items-center rounded-3 side-contact my-shadow ">

               <div class="rounded-3 pfp-sm my-shadow overflow-hidden ">
                    <img src="${contact.image}" alt="${contact.name}'s profile picture" class=" object-fit-cover w-100 h-100 ">
                </div>

                <div class="d-flex flex-column justify-content-center ms-2">
                    <span class="fw-bold my-base-fs">${contact.name}</span>
                    <span class="text-muted my-sm-fs">${contact.phone}</span>
                </div>

                 <div class="ms-auto p-2 bg-secondary-subtle rounded-3 phone-icon">
                    
                    <a href="tel:${contact.phone}" class="anchor"> <i class="fa-solid fa-phone-flip text-success"></i> </a>

                    
                </div>

            </div>
        </div>
        `;
    });
    updateTotalEmergencyNum();
}

function validate(element, alertId) {

    if (regex[element.id].value.test(element.value) == false) {
        document.getElementById(alertId).classList.remove('d-none');
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        regex[element.id].isValid = false;
    } else {
        document.getElementById(alertId).classList.add('d-none');
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        regex[element.id].isValid = true;
    }

    toggleAddContactBtn();
    toggleUpdateContactBtn();
}

function areAllInputsValid() {
    return Object.values(regex).every(function (field) {
        return field.isValid;
    });
}

function toggleAddContactBtn() {
    addContactBtn.disabled = !areAllInputsValid();
}

function toggleUpdateContactBtn() {
    updateContactBtn.disabled = !areAllInputsValid();
}
