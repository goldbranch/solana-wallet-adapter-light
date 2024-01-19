import { Adapter } from "@solana/wallet-adapter-base";

export const createHtmlAdapter:(wl: Adapter) => {elementToAppend: HTMLElement, elementToBindConnectAction: HTMLElement} = (wl) => {
    const liElement: HTMLElement = document.createElement('li');

    const buttonElement = document.createElement('button');
    buttonElement.classList.add('swal-button');
    buttonElement.tabIndex = 0;
    buttonElement.type = 'button';

    const iconElement = document.createElement('i');
    iconElement.classList.add('swal-button-start-icon');

    const imgElement = document.createElement('img');
    imgElement.src = wl.icon;
    iconElement.appendChild(imgElement);

    buttonElement.appendChild(iconElement);
    buttonElement.appendChild(document.createTextNode(wl.name));
    const spanElement = document.createElement('span');

    if (wl.readyState == 'Installed')
      spanElement.appendChild(document.createTextNode('Detected'));
    buttonElement.appendChild(spanElement);

    liElement.appendChild(buttonElement);

    return {
      elementToAppend: liElement,
      elementToBindConnectAction: buttonElement
    }
  }


  export const createHtmlBase: () => void = () => {
    // Créez un élément div pour le conteneur principal
    const swalModal: HTMLDivElement = document.createElement('div');
    swalModal.id = 'swal-modal';
    swalModal.className = 'swal-modal';

    // Créez le conteneur intérieur
    const modalContainer: HTMLDivElement = document.createElement('div');
    modalContainer.className = 'swal-modal-container';

    // Créez le wrapper
    const modalWrapper: HTMLDivElement = document.createElement('div');
    modalWrapper.className = 'swal-modal-wrapper';

    // Créez le bouton de fermeture
    const closeBtn: HTMLButtonElement = document.createElement('button');
    closeBtn.id = 'swal-close-btn';
    closeBtn.className = 'swal-modal-button-close';

    // Créez l'icône dans le bouton de fermeture
    const closeBtnIcon: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeBtnIcon.setAttribute('width', '14');
    closeBtnIcon.setAttribute('height', '14');

    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z');

    closeBtnIcon.appendChild(path);
    closeBtn.appendChild(closeBtnIcon);

    // Créez le titre
    const modalTitle: HTMLHeadingElement = document.createElement('h1');
    modalTitle.className = 'swal-modal-title';
    modalTitle.textContent = 'Connect a wallet on Solana to continue';

    // Créez la liste
    const adapterList: HTMLUListElement = document.createElement('ul');
    adapterList.id = 'swal-adapter-list';
    adapterList.className = 'swal-modal-list';

    // Ajoutez tous les éléments dans la structure souhaitée
    modalWrapper.appendChild(closeBtn);
    modalWrapper.appendChild(modalTitle);
    modalWrapper.appendChild(adapterList);
    modalContainer.appendChild(modalWrapper);
    swalModal.appendChild(modalContainer);

    // Ajoutez le fond d'overlay
    const modalOverlay: HTMLDivElement = document.createElement('div');
    modalOverlay.className = 'swal-modal-overlay';
    swalModal.appendChild(modalOverlay);

    // Utilisation du résultat (par exemple, ajout à un élément existant dans le DOM)
    document.body.appendChild(swalModal);
  };