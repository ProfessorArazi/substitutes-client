import { useContext, useEffect } from "react";
import WorksContext from "../store/works-context";
import { WorksFormat } from "../Components/Works/WorksFormat";
import { httpRequest } from "../httpRequest";
import { Button } from "react-bootstrap";
import { WorksForm } from "../Components/Forms/WorksForm";
import { storageObject } from "../Components/Storage/storageObject";
import { toast } from "react-toastify";

export const SchoolWorks = () => {
  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    oldWorks,
    updateUserWorks,
    updateNotifications,
    showLoading,
    showModal,
    loading,
  } = ctx;

  const structures = [
    {
      title: "עבודות זמינות",
      works: closeWorks,
      className: "old-section",
    },

    {
      title: "עבודות ישנות",
      works: oldWorks,
    },
  ];

  const onDeleteHandler = async (userId, id) => {
    showLoading(true);
    const res = await httpRequest(
      "post",
      `/school/works/${userId}/${id}`,
      {
        email: JSON.parse(sessionStorage.getItem("user")).school.email,
        userId: JSON.parse(sessionStorage.getItem("user")).school._id,
        type: "school",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );
    if (res.data) {
      if (res.data.error) {
        showLoading(false);
        return toast.error(res.data.error, {
          autoClose: 1000,
          position: "top-left",
          theme: "colored",
          hideProgressBar: true,
        });
      }
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("school", res.data))
      );
      updateUserWorks({
        works: { works: res.data.school.works, type: "school" },
      });
    } else {
      console.log(res.err);
    }
    showLoading(false);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user.school.justLoggedIn) {
      return sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("school", user))
      );
    }
    const updateStorage = async () => {
      showLoading(true);
      const res = await httpRequest(
        "post",
        "/school/works",
        {
          userId: user.school._id,
          email: user.school.email,
          type: "school",
        },
        { token: user.token }
      );

      if (res.data) {
        updateUserWorks({
          works: { works: res.data.school.works, type: "school" },
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify(storageObject("school", res.data))
        );
        updateNotifications(res.data.school.notifications);
      } else console.log(res.err);

      showLoading(false);
    };

    updateStorage();
  }, [updateNotifications, updateUserWorks, showLoading]);

  return (
    <>
      {!loading && (
        <div className="add-work__btn">
          <Button
            onClick={() =>
              showModal(<WorksForm onClose={() => showModal(false)} />)
            }
            className=" light-blue__btn"
          >
            הוסף עבודה
          </Button>
        </div>
      )}

      {loading ? (
        loading
      ) : (
        <>
          {" "}
          {structures.map((structure, i) => (
            <WorksFormat
              key={i}
              title={structure.title}
              type="school"
              works={structure.works}
              onDelete={(userId, id) => onDeleteHandler(userId, id)}
              onEdit={(work) =>
                showModal(
                  <WorksForm onClose={() => showModal(false)} work={work} />
                )
              
              }
              className={structure.className}
            />
          ))}
        </>
      )}
    </>
  );
};
