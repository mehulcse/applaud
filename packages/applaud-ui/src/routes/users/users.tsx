import React, { useState } from "react";
import { Box, FormControlLabel, Grid, Switch, Button, Typography } from "@material-ui/core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UsersTable from "./users-table";
import { SearchInput } from "../../components/search-input";
import AppIcon from "../../components/app-icon";
// import AddUserDialog from "./add-user-dialog";
import { PAGE_LIMIT } from "../../constants/constants";
import PaperBox from "../../components/paper-box";
import PageLayout from "../../components/page-layout";
import AddUserDialog from "./add-user-dialog";
import UpdateUserDialog from "./update-user-dialog";

export default function Users() {
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUserId, setEditUserId] = useState(0);

  // TODO: Query Users
  const queryResult = {
    data: {
      users: {
        totalCount: 150,
        nodes: [
          {
            id: 1,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 2,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 3,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 4,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 5,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 6,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 7,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 8,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 9,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 10,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 11,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 12,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 13,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 14,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 15,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 16,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 17,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 18,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 19,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
          {
            id: 20,
            name: "jitesh",
            email: "j@tech9.com",
            team: {
              id: 1,
              name: "RCM"
            },
            department: {
              id: 1,
              name: "IT"
            }
          },
        ]
      }
    }
  };

  function onChange(value: string) {
    setSearch(value);
  }

  function handleAddUser() {
    setShowAddUser(true);
  }

  function closeDialog() {
    setShowAddUser(false);
    // TODO: add refetch of queryResult
  }

  function onEdit(userId: number) {
    setEditUserId(userId);
  }

  function updateCloseDialog() {
    setEditUserId(0);
  }

  return (
    <PageLayout pageTitle="Users">
      <PaperBox>
        <Box marginY={2}>
          <Button
            color="primary"
            onClick={handleAddUser}
            variant="outlined"
          >
            <AppIcon icon={faPlus} standardRightMargin />
            Add User
          </Button>
        </Box>
        <Box marginY={2}>
          <Grid container>
            <Grid container xs={6} item>
              <SearchInput
                inputValue={search}
                placeholder="Search User"
                onChange={onChange}
              />
            </Grid>
          </Grid>
        </Box>
        <Box marginY={2}>
          <UsersTable
            queryResult={queryResult}
            onEditClick={onEdit}
          />
        </Box>
        <AddUserDialog open={showAddUser} onClose={closeDialog} />
        <UpdateUserDialog userId={editUserId} open={Boolean(editUserId)} onClose={updateCloseDialog} />
      </PaperBox>
    </PageLayout>
  );
}
