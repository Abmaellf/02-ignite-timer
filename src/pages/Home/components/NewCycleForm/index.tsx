import { useForm } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: 
        zod.number()
            .min(1, 'O ciclo precisa ser de no mínimo de 5 minutos') /* ajuste para um minuto para teste*/
            .max(60, 'O ciclo precisa se de no maximo de 60 minutos')
   
})
/*      Preferimos utilizar uma interface quando vamos definir um objeto de validação
        interface NewCycleFormData {
            task: string;
            minutesAmount: number;
        }     
*/

/* E prefirimos utilizaro type quando vamos criar uma tipagem apartir de outra referencia ou variável: do typescript*/
/* Agora não é mais necessário utilizar a interface */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function NewCycleForm() {

    /*formState  - fornece uma variavel chamada errors, possibilitando identificar as mensagens que ocorre em nosso form: formState.errors  // console.log(formState.errors) */
    const { register, handleSubmit, watch, reset /*formState*/ } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,  
        }
    })
    return(
        <FormContainer>
                     <label htmlFor="task">Vou trabalhar em</label>

                     <TaskInput 
                        id="task" 
                        list="task-suggestions" 
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
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
                        min={1} /*Ajustes de 5 para 1, para teste*/
                        max={60}
                        disabled={!!activeCycle}
                        {... register('minutesAmount', { valueAsNumber: true})}
                    />
 
                     <span>Minutos.</span>
                 </FormContainer>
    )

}