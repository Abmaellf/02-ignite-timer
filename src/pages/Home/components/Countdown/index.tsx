import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";

 export function Countdown() {
    const { 
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed
     } = useContext(CyclesContext)
    
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
                    new Date(activeCycle.startDate)
                ) /*calcula a diferença de segundos que já passaram, da data atual para data que começou o cliclo dentro de um intervalo de segundos começou o cilco  */
                
                if (secondsDifference >= totalSeconds ) {
                    markCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)

                clearInterval(interval)
                } else {
                    setSecondsPassed( secondsDifference )

                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId,setSecondsPassed, markCurrentCycleAsFinished])

     const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
    
       const minutesAmount = Math.floor(currentSeconds / 60)  // Dividindo o total de secundos por sessenta e arredondando para baixo
       const secondsAmount = currentSeconds % 60
    
       const minutes = String(minutesAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres
       const seconds = String(secondsAmount).padStart(2, '0') // padStart sempre vai preencher com 2 caracteres
    
       useEffect(()=> {
        if(activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
       }, [minutes, seconds, activeCycle])
    
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