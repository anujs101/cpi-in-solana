use solana_program::{
    entrypoint, 
    account_info::{
        next_account_info,
        AccountInfo
    }, 
    entrypoint::ProgramResult, 
    pubkey::Pubkey,
    program::invoke,
    instruction::{Instruction, AccountMeta}
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    let double_program_account = next_account_info(&mut iter)?;

    let instruction = Instruction {
        program_id: *double_program_account.key,
        accounts: vec![AccountMeta::new(*data_account.key, true)],
        data: instruction_data.to_vec(),
    };

    invoke(
        &instruction,
        &[data_account.clone()],
    )?;

    ProgramResult::Ok(())
}