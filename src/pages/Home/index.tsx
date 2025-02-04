import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'; /* zod não tem um export default, então temos que renomear*/
import { differenceInSeconds } from "date-fns";

import { 
        CountdownContainer, 
        FormContainer, 
        HomeContainer, 
        MinutesAmountInput, 
        Separator, 
        StartCountdownButton, 
        StopCountdownButton, 
        TaskInput 
} from "./styles";
import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";


// Prop Drilling --> Quando agente tem MUITAS proprieddes APENAS para comunicação entre compopnentes 
// Context API --> Permite compartilharmos informações entre VÁRIOS   componentes ao mesmo tempo

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;      // data que ele ficou ativo
    interruptedDate?: Date // Data da interrupção do cicloEssa data é opcional
    finishedDate?: Date // Data da conclusão do ciclo Essa data é opcional
} 
interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]) /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished () {
       
            setCycles(state =>  state.map((cycle) => {
                if(cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() }
                 } else {
                     return cycle
                 }
             })
        )
    }

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

    // function handleCreateNewCycle(data: NewCycleFormData) {

    //     const  id = String(new Date().getTime())

    //     const newCycle: Cycle = {
    //         id,
    //         task: data.task,
    //         minutesAmount: data.minutesAmount,
    //         startDate: new Date(),
    //     }
    //     // setCycles([...cycles, newCycle])  /* Correto, mas como esse valor depende do valor atual vamos setar na forma de funççao*/
        
    //      setCycles((state) =>[...state, newCycle])  
    //      setActiveCycleId(id)
    //      setAmountSecondsPassed(0)
        
    //     reset();
    // }

   function handleInterruptCycle() {
       
       setCycles((state) =>
       state.map((cycle) => {
               if(cycle.id === activeCycleId) {
                   return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
  }

  
    
    // const task = watch('task')

    // const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form /* onSubmit={handleSubmit(handleCreateNewCycle)} */ action="">

            <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>

               <NewCycleForm />

               {/* /* PROPRIEDADES UTILIZADA PELO COUNTDOWN  activeCycle={activeCycle}  setCycles={setCycles}activeCycleId={activeCycleId} */}
               <Countdown   />

            </CyclesContext.Provider>
           
               { activeCycle ? (
                        <StopCountdownButton onClick={handleInterruptCycle} type="button">
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton>
                    ) : (
                        <StartCountdownButton/* disabled={isSubmitDisabled} */type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
               }

            </form> 
        </HomeContainer>
    )
}