import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
    return(
        <HistoryContainer>

            <h1> Meu Historico </h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th> Tarefa</th>
                            <th> Duração</th>
                            <th> Inicio</th>
                            <th> Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td> Conserto de débito técnico </td>
                            <td> 25 minutos </td>
                            <td> Há cerca de 2 semana </td>
                            <td>
                                <Status statusColor="green"> Concluido </Status>
                            </td>
                        </tr>

                        <tr>
                            <td> Conserto de débito técnico </td>
                            <td> 25 minutos </td>
                            <td> Há cerca de 2 semana </td>
                            <td>
                                <Status statusColor="red"> Interrompido </Status>
                            </td>
                        </tr>

                        <tr>
                            <td> Conserto de débito técnico </td>
                            <td> 25 minutos </td>
                            <td> Há cerca de 2 semana </td>
                            <td>
                                <Status statusColor="yellow"> Em andamento </Status>
                            </td>
                        </tr>

                        <tr>
                            <td> Conserto de débito técnico </td>
                            <td> 25 minutos </td>
                            <td> Há cerca de 2 semana </td>
                            <td>
                                <Status statusColor="green"> Em andamento </Status>
                            </td>
                        </tr>

                        <tr>
                            <td> Conserto de débito técnico </td>
                            <td> 25 minutos </td>
                            <td> Há cerca de 2 semana </td>
                            <td>
                                <Status statusColor="yellow"> Em andamento </Status>
                            </td>
                        </tr>

                    </tbody>
                </table>    
            </HistoryList>
        </HistoryContainer>
    )
}