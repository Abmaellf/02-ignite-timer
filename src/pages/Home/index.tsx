import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'; /* zod não tem um export default, então temos que renomear*/

import { 
        CountdownContainer, 
        FormContainer, 
        HomeContainer, 
        MinutesAmountInput, 
        Separator, 
        StartCountdownButton, 
        TaskInput 
} from "./styles";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(5, 'O ciclo precisa ser de no mínimo de 5 minutos')
            .max(60, 'O ciclo precisa se de no maximo de 60 minutos'), 
})

export function Home() {
    /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const { register, handleSubmit, watch, /*formState*/ } = useForm({
        resolver: zodResolver(newCycleFormValidationSchema),
    })

    function handleCreateNewCycle(data) {
        console.log(data)
    }

   

    const task = watch('task')
    const isSubmitDisabled = !task


    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                 <FormContainer>
                     <label htmlFor="task">Vou trabalhar em</label>

                     <TaskInput 
                        id="task" 
                        list="task-suggestions" 
                        placeholder="Dê um nome para o seu projeto"
                        {... register('task')}
                    />

                     <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Banana"/>
                     </datalist>
 
                     <label htmlFor="">Durante</label>

                     <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        step={5}
                        min={5}
                        max={60}
                        {... register('minutesAmount', { valueAsNumber: true})}
                    />
 
                     <span>Minutos.</span>
                 </FormContainer>
           
                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form> 
        </HomeContainer>
    )
}