export type SolanaWall = {
  version: "0.1.0";
  name: "solana_wall";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "wallAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "message";
          type: "bytes";
        },
        {
          name: "name";
          type: "bytes";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "wallAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "message";
            type: "bytes";
          },
          {
            name: "name";
            type: "bytes";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "IncorrectNameLength";
      msg: "name can't be longer than 32 bytes.";
    },
    {
      code: 6001;
      name: "IncorrectMessageLength";
      msg: "message can't be longer than 280 bytes.";
    }
  ];
};

export const IDL: SolanaWall = {
  version: "0.1.0",
  name: "solana_wall",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "wallAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "message",
          type: "bytes",
        },
        {
          name: "name",
          type: "bytes",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "wallAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "message",
            type: "bytes",
          },
          {
            name: "name",
            type: "bytes",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "IncorrectNameLength",
      msg: "name can't be longer than 32 bytes.",
    },
    {
      code: 6001,
      name: "IncorrectMessageLength",
      msg: "message can't be longer than 280 bytes.",
    },
  ],
};
