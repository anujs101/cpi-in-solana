use borsh::{BorshDeserialize,BorshSerialize};
use solana_program::{
    account_info::{next_account_info,AccountInfo},
    entrypoint::ProgramResult,
    entrypoint,
    program_error::ProgramError,
    pubkey::Pubkey
};
#[derive(BorshSerialize,BorshDeserialize)]
struct OnChainData{
    count: u32
}
entrypoint!(process_instruction);
fn process_instruction(
    _program_id: &Pubkey,
    accounts:&[AccountInfo],
    instruction_data: &[u8],
)->ProgramResult {
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    if(data_account.is_signer!=true){
        return Err(ProgramError::MissingRequiredSignature);
    }
    let mut counter_data = OnChainData::try_from_slice(&data_account.data.borrow_mut())?;
    if counter_data.count==0{
        counter_data.count =1;
    } else {
        counter_data.count *=2;
    }
    counter_data.serialize(&mut *data_account.data.borrow_mut())?;
    Ok(())
}