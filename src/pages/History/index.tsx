import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";

export function History() {
    const { cycles } = useContext(CyclesContext)
    return(
        <HistoryContainer>

            <h1> Meu Historico </h1>
            {/* <pre>  {JSON.stringify(cycles, null, 2)} </pre> */}

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
                        {cycles.map((cycle)=> {
                            return(
                                <tr key={cycle.id}>
                                    <td> {cycle.task} </td>
                                    <td> {cycle.minutesAmount} </td>
                                    <td> {cycle.startDate.toISOString()} </td>
                                    <td>
                                        { cycle.finishedDate && (<Status statusColor="green"> Concluido </Status>) }
                                        { cycle.interruptedDate && (<Status statusColor="red"> Interrompido </Status>) }
                                        { !cycle.finishedDate && !cycle.interruptedDate && (<Status statusColor="yellow"> Em andamento </Status>) }
                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>    
            </HistoryList>
        </HistoryContainer>
    )
}