let choiceHistory = [];
let choiceIdHistory = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch('historia.xml')
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");
            displayStory(xml);
            displayChoices(xml.querySelector('level1'));
        })
        .catch(err => {
            console.error('Erro ao carregar a história:', err);
        });
});

function displayStory(xml) {
    const title = xml.querySelector('story').getAttribute('title');
    const introduction = xml.querySelector('introduction').textContent;

    document.querySelector('h1').textContent = title;
    document.getElementById('introduction').textContent = introduction;
}

function displayChoices(node) {
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    console.log('Node:', node);

    const img = createChoiceImage(node.querySelector(':scope > choice'));
    choicesDiv.appendChild(img);

    const choices = node.querySelectorAll(':scope > choice');
    choices.forEach(choice => {
        console.log('Choice:', choice);

        const choiceContainer = document.createElement('div');
        choiceContainer.classList.add('choice-container');

        const btn = createChoiceButton(choice);

        btn.addEventListener('click', () => handleChoiceSelection(choice));

        choiceContainer.appendChild(btn);
        choicesDiv.appendChild(choiceContainer);
    });

    if (choiceHistory.length > 0) {
        const backButton = createBackButton();
        backButton.addEventListener('click', handleBackButtonClick);
        choicesDiv.appendChild(backButton);
    }

    const allChoicesMade = Array.from(choices).every(choice => choiceHistory.includes(choice.getAttribute('id')));

    console.log('All choices made:', allChoicesMade);

    if (allChoicesMade) {
        const finishButton = createFinishButton();
        finishButton.addEventListener('click', handleFinishButtonClick);
        choicesDiv.appendChild(finishButton);
    }
}


function createChoiceButton(choice) {
    const btn = document.createElement('button');
    btn.textContent = choice.getAttribute('description');
    btn.classList.add('choice-button');
    return btn;
}

function createChoiceImage(choice) {
    const img = document.createElement('img');
    const imageSrc = choice.getAttribute('image');
    if (imageSrc) {
        img.src = imageSrc;
        img.classList.add('img');
    }
    return img;
}

function handleChoiceSelection(choice) {
    addChoiceToHistory(choice.getAttribute('description'));
    addChoiceIdToHistory(choice.getAttribute('id'));

    const feedbackText = getFeedbackText(choice.getAttribute('id'));
    displayFeedback(feedbackText);

    const nextLevel = choice.querySelector(':scope > level2, :scope > level2, :scope > level3, :scope > level4, :scope > level5, :scope > level6, :scope > level7');

    const validIds = ['B2b2b', 'A2b2b', 'A1a1a', 'A1a1b', 'A1a2a', 'A1a2b', 'A1b1a', 'A1b1b', 'A1b2a', 'A1b2b', 'A2a1', 'A2a1a', 'A2a1b', 'A2a2a', 'A2a2b', 'A2b1a', 'A2b1b', 'A2b2a',  'B1a1a', 'B1a1b', 'B1a2a', 'B1a2b', 'B1b2a', 'B1b1b', 'B1b2b', 'B2a1a', 'B2a1b', 'B2a2a', 'B2a2b', 'B2b1a', 'B2b1b', 'B2b2a', 'B2b2b'];

    if (nextLevel) {
        choiceHistory.push(choice.parentNode);
        displayChoices(nextLevel);
    } else {
        const choiceId = choice.getAttribute('id');
        console.log('Choice ID:', choiceId);
    
        if (validIds.includes(choiceId)) {
            const finishButton = createFinishButton();
            finishButton.addEventListener('click', handleFinishButtonClick);
            document.getElementById('choices').appendChild(finishButton);
        }
    }
}   
function isFinalChoice(choiceId) {
    // Define os IDs finais que acionam o final do jogo
    const finalChoiceIds = ['A2b2b', 'B2b2b'];

    return finalChoiceIds.includes(choiceId);
}

function createBackButton() {
    const backButton = document.createElement('button');
    backButton.textContent = "Voltar";
    backButton.classList.add('back-button');
    return backButton;
}

function handleBackButtonClick() {
    removeLastChoiceFromHistory();
    removeLastChoiceIdFromHistory();
    displayFeedback(""); // Limpa o feedback ao voltar
    const previousChoice = choiceHistory.pop();
    displayChoices(previousChoice);
}

function addChoiceToHistory(choice) {
    const li = document.createElement('li');
    li.textContent = choice;
    document.querySelector('#choice-history ul').appendChild(li);
}

function removeLastChoiceFromHistory() {
    const ul = document.querySelector('#choice-history ul');
    if (ul.lastChild) {
        ul.removeChild(ul.lastChild);
    }
}

function addChoiceIdToHistory(choiceId) {
    const li = document.createElement('li');
    li.textContent = choiceId;
    document.querySelector('#choice-id-history ul').appendChild(li);
}

function removeLastChoiceIdFromHistory() {
    const ul = document.querySelector('#choice-id-history ul');
    if (ul.lastChild) {
        ul.removeChild(ul.lastChild);
    }
}

function getFeedbackText(choiceId) {
    if (choiceId === 'A') {
        return "Feedback: Essa decisão resultou em uma maior disponibilidade de terras para a agricultura, permitindo uma plantação mais extensa. No entanto, essa ação teve um impacto significativo na biodiversidade da região, com a perda de habitats naturais e redução na diversidade de espécies.";
    } else if (choiceId === 'A1') {
        return "Feedback: Os fertilizantes químicos podem aumentar significativamente o crescimento das plantas, resultando em uma colheita inicialmente mais abundante. No entanto, o uso frequente de fertilizantes químicos podem prejudicar a qualidade do solo e contaminar os recursos hídricos da região a longo prazo.";
    } else if (choiceId === 'A1a') {
        return "Feedback: É uma estratégia que pode levar a lucros rápidos, no entanto, monoculturas de milho e soja podem esgotar rapidamente o solo e aumentar a suscetibilidade a pragas específicas dessas culturas.";
    } else if (choiceId === 'A1a1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode apresentar impactos negativos ao meio ambiente, prejudicando a biodiversidade e contaminando a água e o solo.";
    } else if (choiceId === 'A1a1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A1a1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A1a2') {
        return "Feedback: Inserir predadores naturais em seu plantio para controle de pragas ajuda a manter o equilíbrio ecológico em sua fazenda. Evitando o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'A1a2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método irá demorar e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A1a2b') {
        return "Feedback: A colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A1b') {
        return "Feedback: Plantar legumes e frutas acaba por preservar o solo e a diversidade de culturas. Essas culturas são conhecidas por melhorar a qualidade do solo e são uma opção mais sustentável, contribuindo para a saúde do ecossistema.";
    } else if (choiceId === 'A1b1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'A1b1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A1b1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A1b2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'A1b2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A1b2b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A2') {
        return "Feedback: Você optou pela compostagem, compensando assim o desmatamento. Essa abordagem ajuda a manter a saúde do solo a longo prazo, preservando o equilíbrio ambiental e promovendo a sustentabilidade em sua fazenda.";
    } else if (choiceId === 'A2a') {
        return "Feedback: Monoculturas de milho e soja podem levar a lucros rápidos, no entanto, acabam por esgotar rapidamente o solo e aumentar a suscetibilidade a pragas específicas dessas culturas.";
    } else if (choiceId === 'A2a1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Resultando em uma colheita saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'A2a1a') {
        return "Feedback: Animais como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. Porém, o treinamento e cuidados adequados com os animais podem demorar para apresentar resultados positivos.";
    } else if (choiceId === 'A2a1b') {
        return "Feedback:  Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Tal abordagem é trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A2a2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'A2a2a') {
        return "Feedback: Cavalos ou bois podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A2a2b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A2b') {
        return "Feedback: Plantar legumes e frutas acaba por promover a preservação do solo e a diversidade de culturas. Essas culturas são conhecidas por melhorar a qualidade do solo e são uma opção mais sustentável, contribuindo para a saúde do ecossistema.";
    } else if (choiceId === 'A2b1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'A2b1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A2b1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Tal abordagem é trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'A2b2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'A2b2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'A2b2b') {
        return "Feedback: Optar pela colheita manual irá reduzir o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem é trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";

        //FINAL FEEDBACK A 

        //INICIO FEEDBACK B

    } else if (choiceId === 'B') {
        return "Você optou por desmatar apenas o necessário para expandir sua plantação, priorizando o equilíbrio ambiental. Isso manterá parte da floresta intacta, preservando a biodiversidade e minimizando o impacto ambiental.";
    } else if (choiceId === 'B1') {
        return "Os fertilizantes químicos podem aumentar significativamente o crescimento das plantas, resultando em uma colheita inicialmente mais abundante. No entanto, o uso frequente de fertilizantes químicos irão prejudicar a qualidade do solo a longo prazo e contaminar os recursos hídricos da região.";
    } else if (choiceId === 'B1a') {
        return "Feedback: Tal estratégia que pode levar a lucros rápidos, no entanto, monoculturas de milho e soja podem esgotar rapidamente o solo e aumentar a suscetibilidade a pragas específicas dessas culturas."
    } else if (choiceId === 'B1a1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'B1a1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'B1a1b') {
        return "Feedback: A colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B1a2') {
        return "Feedback: Predadores naturais em seu plantio resultam no controle de pragas ecologicamente equilibrado em sua fazenda. Evitando o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'B1a2a') {
    return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'B1a2b') {
        return "Feedback: A colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B1b') {
        return "Feedback: Plantar legumes e frutas é uma decisão que promove a preservação do solo e a diversidade de culturas. Essas culturas são conhecidas por melhorar a qualidade do solo e são uma opção mais sustentável, contribuindo para a saúde do ecossistema."; 
    } else if (choiceId === 'B1b1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'B1b1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";   
    } else if (choiceId === 'B1b1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B1b2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'B1b2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'B1b2b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B2') {
        return "Feedback: Optando por usar fertilizantes orgânicos por meio da compostagem, você acaba compensando o desmatamento parcial. Tal abordagem ajuda a manter a saúde do solo a longo prazo, preservando o equilíbrio ambiental e promovendo a sustentabilidade em sua fazenda.";
    } else if (choiceId === 'B2a') {
        return "Feedback: É uma estratégia que pode levar a lucros rápidos, no entanto, monoculturas de milho e soja podem esgotar rapidamente o solo e aumentar a suscetibilidade a pragas específicas dessas culturas.";
    } else if (choiceId === 'B2a1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água";
    } else if (choiceId === 'B2a1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";   
    } else if (choiceId === 'B2a1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B2a2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'B2a2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'B2a2b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B2b') {
        return "Feedback: Plantar legumes e frutas é uma decisão que promove a preservação do solo e a diversidade de culturas. Essas culturas são conhecidas por melhorar a qualidade do solo e são uma opção mais sustentável, contribuindo para a saúde do ecossistema";
    } else if (choiceId === 'B2b1') {
        return "Feedback: Você conseguirá proteger suas culturas de pragas e doenças de forma eficaz. Isso pode resultar em uma colheita mais saudável e abundante. No entanto, o uso excessivo de pesticidas químicos pode ter impactos negativos no meio ambiente, prejudicando a biodiversidade e contaminando o solo e a água.";
    } else if (choiceId === 'B2b1a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais.";
    } else if (choiceId === 'B2b1b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    } else if (choiceId === 'B2b2') {
        return "Feedback: Inserir predadores naturais em seu plantio é uma abordagem de controle de pragas que ajuda a manter o equilíbrio ecológico em sua fazenda. Isso evita o uso de pesticidas químicos prejudiciais ao meio ambiente, preservando a biodiversidade e promovendo uma agricultura sustentável.";
    } else if (choiceId === 'B2b2a') {
        return "Feedback: Os animais, como cavalos ou bois, podem ser usados para puxar arados, colheitadeiras e outros equipamentos agrícolas, minimizando a dependência de combustíveis fósseis e reduzindo a poluição do ar. No entanto, esse método pode ser mais demorado e requer treinamento e cuidados adequados com os animais";
    } else if (choiceId === 'B2b2b') {
        return "Feedback: Optar pela colheita manual reduz o impacto no solo e nas plantas, promovendo a sustentabilidade em sua fazenda. Esta abordagem pode ser mais trabalhosa, mas resulta em menor compactação do solo e menos danos às plantas.";
    }
}


function getOverallFeedback(choiceHistory) {
    // Lógica para calcular o feedback geral com base nas escolhas feitas
    let overallFeedback = "Feedback Geral:\n";

    // Concatenando mensagens de feedback das escolhas realizadas
    for (let i = 0; i < choiceHistory.length; i++) {
        overallFeedback += "- " + choiceHistory[i].feedback + "\n";
    }

    return overallFeedback;
}

function createFinishButton() {
    const finishButton = document.createElement('button');
    finishButton.textContent = "Finalizar";
    finishButton.classList.add('finish-button');

    // Adicione um ouvinte de evento para chamar handleFinishButtonClick ao clicar no botão
    finishButton.addEventListener('click', handleFinishButtonClick);

    // Adicione o botão ao seu contêiner desejado (substitua 'buttonContainer' pelo ID ou classe apropriado)
    const buttonContainer = document.getElementById('choices');
    buttonContainer.appendChild(finishButton);

    console.log(getOverallFeedback([])); // Agora você pode imprimir o feedback aqui
}

function handleFinishButtonClick() {
    // Lógica para finalizar o jogo
    // Limpar a tela, exibir uma mensagem de finalização, reiniciar, etc.
    choiceHistory = [];
    choiceIdHistory = [];

    // Ocultar as opções de escolha
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    // Exibir feedback geral
    const overallFeedback = getOverallFeedback(choiceHistory);
    displayFeedback(overallFeedback);

    console.log("Botão Finalizar Clicado");
}

function displayFeedback(feedback) {
    // Crie um elemento para mostrar o feedback
    const feedbackDiv = document.createElement('div');
    feedbackDiv.textContent = feedback;

    // Adicione o elemento à sua página onde deseja exibir o feedback
    // Substitua 'feedbackContainer' pelo ID ou classe do elemento desejado
    const feedbackContainer = document.getElementById('feedback-text');
    feedbackContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior
    feedbackContainer.appendChild(feedbackDiv);
}

// Certifique-se de chamar createFinishButton em algum lugar para criar o botão
createFinishButton();
