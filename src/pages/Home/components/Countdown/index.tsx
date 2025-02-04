import { useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";

interface  CountdownProps {
    activeCycle: any,
    setCycles: any,
    activeCycleId: any
}


 export function Countdown() {

    const [amountSecondsPasse, setAmountSecondsPassed] = useState(0) // O total de segundos que já se passou, desde que o ciclo foi ativado
    
    const totalSeconds =  activeCycle ? activeCycle.minutesAmount * 60 : 0  // Verifica se tem ciclo ativo e se ativo, então o total de segundos será o minutos do ciclo ativo vezez 60 se não zero


    /*o useEffect pode ter um retorno*/
    /* useEffect({ return },[])*/
    /*Esse  useEffect é para calcular a diferença do tempo passado em cada segundo e
      E se a diferença for maior ou igual ao total de segundos defindo(no caso terminou) então chama a função de finalizar
    */
    useEffect(() => {
        let interval: number;

        if (activeCycle) {

            interval = setInterval(()=> {

               const secondsDifference =  differenceInSeconds( 
                    new Date(), 
                    activeCycle.startDate
                ) /*calcula a diferença de segundos que já passaram, da data atual para data que começou o cliclo dentro de um intervalo de segundos começou o cilco  */
                
                if (secondsDifference >= totalSeconds ) {
                    setCycles(state =>  state.map((cycle) => {
                        if(cycle.id === activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                         } else {
                             return cycle
                         }
                     })
                )
                
                setAmountSecondsPassed(totalSeconds)

                clearInterval(interval)
                } else {
                    setAmountSecondsPassed( secondsDifference )

                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId])

    
    return(
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}