import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'; /* zod não tem um export default, então temos que renomear*/

import {
        HomeContainer, 
        StartCountdownButton, 
        StopCountdownButton, 
} from "./styles";
import { useContext,   } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";


// Prop Drilling --> Quando agente tem MUITAS proprieddes APENAS para comunicação entre compopnentes 
// Context API --> Permite compartilharmos informações entre VÁRIOS   componentes ao mesmo tempo
/*      Preferimos utilizar uma interface quando vamos definir um objeto de validação
        interface NewCycleFormData {
            task: string;
            minutesAmount: number;
        }     
*/

/* E prefirimos utilizaro type quando vamos criar uma tipagem apartir de outra referencia ou variável: do typescript*/
/* Agora não é mais necessário utilizar a interface */

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(1, 'O ciclo precisa ser de no mínimo de 5 minutos') /* ajuste para um minuto para teste*/
            .max(60, 'O ciclo precisa se de no maximo de 60 minutos')
   
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const { activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)

 /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const newCycleForm  = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,  
        }
    })

    const { handleSubmit, watch, reset  } = newCycleForm
    
    // handle será chamado diretamente de um evento
    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }
    
    const task = watch('task')

    const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form  onSubmit={handleSubmit(handleCreateNewCycle)}  action="">

           
                {/* /*FormProvider é o context padrão do react-hook-form */}
               <FormProvider {... newCycleForm}>
                    <NewCycleForm />
               </FormProvider>

               {/* /* PROPRIEDADES UTILIZADA PELO COUNTDOWN  activeCycle={activeCycle}  setCycles={setCycles}activeCycleId={activeCycleId} */}
               <Countdown   />

           
           
               { activeCycle ? (
                        <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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