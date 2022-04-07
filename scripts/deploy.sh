# lots of inspo from https://github.com/bucket-dao/bucket-program/blob/main/scripts/deploy.sh

if [ $# -eq 0 ]; then
    echo "Must provide at least 1 param to specify if script should deploy or upgrade"
    exit 1
fi

update_flag=$1

# deploy from scratch:

# get current / old program pk
current_program_pk=`solana-keygen pubkey ./target/deploy/solana_wall-keypair.json`

# if we do not upgrade, we will deploy a new copy of the program
if [ $# -eq 1 ]; then
    if [ "$1" = deploy ]; then
        # discontinue old program (if present)
        mv ./target/deploy/solana_wall-keypair.json ./target/deploy/solana_wall-keypair-`ls | wc -l | xargs`.json
        
        # build program, this will generate a new program id
        anchor build
        
        # replace all program ids with new id
        new_program_pk=`solana-keygen pubkey ./target/deploy/bucket_program-keypair.json`
        echo New public key: $new_program_pk
        
        targets=$(find . -type f  -exec grep -lir --include=*.{ts,tsx,rs,toml} $current_program_pk {} +)
        for target in $targets
        do
            echo 'Replacing pk in ' $target
            sed -i'.original' -e "s/$current_program_pk/$new_program_pk/g" $target
        done
        echo Program public key replaced!
        
        # build again with updated pk
        anchor build
        
        # deploy
        anchor deploy --provider.wallet ./wall-wallet-dev.json --provider.cluster devnet
        
    elif [ "$1" = upgrade ]; then
        echo Using existing public key: $current_program_pk
        
        # build
        anchor build
        
        # upgrade
        anchor upgrade ./target/deploy/solana_wall.so --program-id $current_program_pk --provider.cluster devnet
        
    else
        echo "deploy, upgrade are the only acceptable params"
        exit 1
    fi
else
    echo "please only specify one param"
    exit 1
fi


echo "\nbalance pre deployment"
solana balance

echo "\nreplacing idl"
# replace idl in app
cp -f ./target/idl/solana_wall.json ./app/idl/solana_wall.json

echo "replacing types"
# replace types in app
cp -f ./target/types/solana_wall.ts ./app/types/solana_wall.ts

echo "\nbalance post deployment"
solana balance

echo "\ndone"
