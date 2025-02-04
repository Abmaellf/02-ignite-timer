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
    
}
const CyclesContext = createContext({})

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]) /*Minha lista de task como estado, sempre iniciando com a informaççao do mesmo tipo de utilização */
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  // Ciclo que esta ativo
   
    /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

   

    function handleCreateNewCycle(data: NewCycleFormData) {

        const  id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        // setCycles([...cycles, newCycle])  /* Correto, mas como esse valor depende do valor atual vamos setar na forma de funççao*/
        
         setCycles((state) =>[...state, newCycle])  
         setActiveCycleId(id)
         setAmountSecondsPassed(0)
        
        reset();
    }

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

    
    const task = watch('task')
    const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

               <NewCycleForm />  

               <Countdown  
                    activeCycle={activeCycle}
                    setCycles={setCycles}
                    activeCycleId={activeCycleId}
                />
           
               { activeCycle ? (
                        <StopCountdownButton onClick={handleInterruptCycle} type="button">
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton>
                    ) : (
                        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
               }

            </form> 
        </HomeContainer>
    )
}