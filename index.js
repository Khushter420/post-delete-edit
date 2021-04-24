const submitButton = document.getElementById("submit");
const crudlink = "https://crudcrud.com/api/b518a0c2697e498dba37fcb74e0cea07";
var dataID = "";
var isEditing = false;
var currentselectedelement = {};

if (document.readyState !== "loading") {
  async function getUserData() {
    await axios.get(`${crudlink}/registeruser`).then((data) => {
      for (let i = 0; i < data.data.length; i++) {
        addNewLineElement(data.data[i]);
      }
    });
  }
  getUserData();
}

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const emailId = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  if (emailId.length > 0 && name.length > 0) {
    var object = {
      name: name,
      emailId: emailId 
    };

    if (isEditing) {
      isEditing = false;

      axios
        .put(`${crudlink}/registeruser/${dataID}`, object)
        .then((data) => {
          const ul = document.getElementById("user");
          ul.removeChild(currentselectedelement);
          addNewLineElement({ ...object, _id: dataID });
        })
        .catch((err) => {
          const errorspan = document.createElement("span");
          errorspan.appendChild(
            document.createTextNode("Something went wrong, Retry...")
          );
          errorspan.style.color = "red";
          currentselectedelement.appendChild(errorspan);
          setTimeout(() => {
            currentselectedelement.removeChild(errorspan);
          }, 3000);
        });
    } else {
      const response = await axios.post(`${crudlink}/registeruser`, object);

      addNewLineElement(response.data);
    }
  }
});

function addNewLineElement(object) {
  const ul = document.getElementById("user");
  const li = document.createElement("li");
  li.appendChild(
    document.createTextNode(object.name + " " + object.emailId + " ")
  );

  const deletebutton = document.createElement("input");
  deletebutton.type = "button";
  deletebutton.value = "delete";
  deletebutton.addEventListener("click", () => {
    axios
      .delete(`${crudlink}/registeruser/${object._id}`)
      .then((data) => {
        ul.removeChild(li);
      })
      .catch((err) => {
        const errorspan = document.createElement("span");
        errorspan.appendChild(
          document.createTextNode("Something went wrong")
        );
        errorspan.style.color = "red";
        li.appendChild(errorspan);
        setTimeout(() => {
          li.removeChild(errorspan);
        }, 1000);
      });
  });
  deletebutton.className = "delete";
  deletebutton.style.border = "2px solid red";
  li.appendChild(deletebutton);
  const editbutton = document.createElement("input");
  editbutton.type = "button";
  editbutton.value = "Edit";
  editbutton.addEventListener("click", () => {
    isEditing = true;
    dataID = object._id;
    currentselectedelement = li;
    document.getElementById("name").value = object.name;
    document.getElementById("email").value = object.emailId;
  });
  editbutton.style.border = "2px solid green";
  li.appendChild(editbutton);

  ul.appendChild(li);
}