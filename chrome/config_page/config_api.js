function Box(object) {
    let setState = function(box, checkbox) {
        let inputElements = box.getElementsByClassName("box-item-input");
        let state = checkbox.checked;

        if (inputElements) {
            for (let i = 0; i < inputElements.length; i++) {
                inputElements[i].disabled = !state;
            }
        }
    }
    let safeData = function(box) {}

    this.title = object.title;
    this.id = object.id;
    this.hover = object.hover;
    this.description = object.description;
    this.state = object.enabled;
    this.onchange = object.onchange;
    this.itemElements = [];

    this.addItem = function(object) {
        let container = document.createElement("div");
        let inputElement = document.createElement("input");
        let labelElement = document.createElement("label");

        container.classList.add("box-item");
        inputElement.classList.add("box-item-input");
        labelElement.classList.add("box-item-label");

        inputElement.type = object.input.type;
        inputElement.id = object.input.id;
        inputElement.classList.add(`${object.input.type}-css`);
        inputElement.name = this.id;
        inputElement.addEventListener("change", this.onchange);
        
        if (object.input.type === "checkbox") {
            inputElement.checked = object.input.value;
        } else {
            inputElement.value = object.input.value;
        }

        labelElement.innerText = object.title;

        container.appendChild(labelElement);
        container.appendChild(inputElement);

        this.itemElements.push(container);
    }

    this.getBox = function() {
        let box = document.createElement("div");
        let label = document.createElement("label");
        let descriptionLabel = document.createElement("label");
        let checkbox = document.createElement("input");

        box.classList.add("box");
        label.classList.add("box-label");
        descriptionLabel.classList.add("box-description-label");
        checkbox.classList.add("box-checkbox");

        checkbox.type = "checkbox";
        checkbox.id = `${this.id}-checkbox`;
        checkbox.checked = this.state;
        checkbox.addEventListener('build', function() {
            setState(box, checkbox);
        }, false);
        checkbox.addEventListener("change", function() {
            setState(box, checkbox);
        });
        checkbox.addEventListener("change", this.onchange);

        label.innerText = this.title;
        label.style.hover = this.hover;
        
        descriptionLabel.innerText = this.description;

        box.id = this.id;

        box.appendChild(checkbox);
        box.appendChild(label);
        box.appendChild(descriptionLabel);
        
        for (let i=0; i < this.itemElements.length; i++) {
            box.appendChild(this.itemElements[i]);
        }
        setState(box, checkbox);
        return box;
    }
}