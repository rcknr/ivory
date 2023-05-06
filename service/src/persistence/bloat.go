package persistence

import (
	"errors"
	"github.com/google/uuid"
	"ivory/src/config"
	. "ivory/src/model"
	"os"
	"strings"
	"time"
)

type BloatRepository struct {
	bucket *config.Bucket[Bloat]
	file   *config.FileGateway
}

func NewBloatRepository(bucket *config.Bucket[Bloat], file *config.FileGateway) *BloatRepository {
	return &BloatRepository{
		bucket: bucket,
		file:   file,
	}
}

func (r *BloatRepository) List() ([]Bloat, error) {
	return r.bucket.GetList(nil, r.sortDescByCreatedAt)
}

func (r *BloatRepository) ListByStatus(status JobStatus) ([]Bloat, error) {
	return r.bucket.GetList(func(model Bloat) bool {
		return model.Status == status
	}, r.sortDescByCreatedAt)
}

func (r *BloatRepository) ListByCluster(cluster string) ([]Bloat, error) {
	return r.bucket.GetList(func(model Bloat) bool {
		return model.Cluster == cluster
	}, r.sortDescByCreatedAt)
}

func (r *BloatRepository) Get(uuid uuid.UUID) (Bloat, error) {
	return r.bucket.Get(uuid.String())
}

func (r *BloatRepository) GetOpenFile(path string) (*os.File, error) {
	return r.file.Open(path)
}

func (r *BloatRepository) Create(credentialId uuid.UUID, cluster string, args []string) (*Bloat, error) {
	jobUuid := uuid.New()
	compactTableModel := Bloat{
		Uuid:         jobUuid,
		CredentialId: credentialId,
		Cluster:      cluster,
		Status:       PENDING,
		Command:      "pgcompacttable " + strings.Join(args, " "),
		CommandArgs:  args,
		LogsPath:     r.file.Create(jobUuid),
		CreatedAt:    time.Now().UnixNano(),
	}

	err := r.bucket.Update(jobUuid.String(), compactTableModel)
	return &compactTableModel, err
}

func (r *BloatRepository) UpdateStatus(compactTable Bloat, status JobStatus) error {
	tmp := compactTable
	tmp.Status = status
	return r.bucket.Update(tmp.Uuid.String(), tmp)
}

func (r *BloatRepository) Delete(uuid uuid.UUID) error {
	// NOTE: we shouldn't check error here, if there is no file we should try to remove info
	_ = r.file.Delete(uuid)
	return r.bucket.Delete(uuid.String())
}

func (r *BloatRepository) DeleteAll() error {
	errFile := r.file.DeleteAll()
	errBucket := r.bucket.DeleteAll()
	return errors.Join(errFile, errBucket)
}

func (r *BloatRepository) sortDescByCreatedAt(list []Bloat, i, j int) bool {
	return list[i].CreatedAt > list[j].CreatedAt
}
