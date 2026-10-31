(function() {
    const $ = (query: string): HTMLInputElement | null  => document.querySelector(query);
    
    interface Veiculo {
        nome: string;
        placa: string;
        entrada: Date | string;
    }


    function calcTempo(mil: number) {
        const min = Math.floor(mil/ 60000);
        const sec = Math.floor(mil % 60000) / 1000;

        return `${min}m e ${sec}s`;
    }

    function patio() {
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));

        }

        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            const button = row.querySelector(".delete") as HTMLButtonElement | null;
            button?.addEventListener("click", function(this: HTMLButtonElement) {
                remover(this.dataset.placa ?? "");
            });

            $("#patio")?.appendChild(row);

            if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string) {
            // const veiculos = ler().filter((veiculo) => veiculo.placa !== placa);
            // salvar(veiculos);
            // render();
            const veiculo = ler().find((veiculo) => veiculo.placa === placa);
            if (!veiculo) return;            
            const { entrada, nome } = veiculo;
            
            const tempo = calcTempo(
                new Date().getTime() - new Date(entrada).getTime()
            );

            if(!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render()
        }

        function render() {
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length) {
                patio.forEach(veiculo => adicionar(veiculo));

            }
        }

        return { ler, adicionar, remover, salvar, render};
    }
    
    patio().render();
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        // console.log( nome, placa);

        if(!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios")
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);

    });
})();