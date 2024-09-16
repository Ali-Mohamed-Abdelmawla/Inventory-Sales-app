export interface LoginFormInputs {
    email: string,
    password: string
}

export interface LoginFormProps{
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    loading: boolean
}